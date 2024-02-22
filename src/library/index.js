import pTimeout from 'p-timeout';
import uuid from 'react-native-uuid';
import EventSource from 'react-native-sse';
import store from '../store';
import getStorage from 'redux-persist/es/storage/getStorage';

var ChatGPTError = class extends Error {};
var openai;
((openai2) => {})(openai || (openai = {}));

async function fetchSSE(url, options) {
  const es = new EventSource(url, options);
  const listener = (event) => {
    try {
      if (event.type == 'message') {
        options.onMessage(event.data);
        options.eventSource(es);
        if (event.data == '[DONE]') {
          es.removeAllEventListeners();
          es.close();
          return;
        }
      } else if (event.type == 'error') {
        const res = JSON.parse(event?.message);
        const result = {
          id: new Date().toString().replace(/\s/g, ''),
          object: 'chat.completion.chunk',
          created: new Date(),
          model: 'gpt-3.5-turbo-0301',
          choices: [
            {
              delta: {
                content: res.error.message || 'Invalid apiKey',
              },
              index: 0,
              finish_reason: null,
            },
          ],
        };

        options.eventSource(es);
        options.onMessage(
          JSON.stringify(result) ?? 'OpenAI missing required apiKey'
        );
        options.onMessage('[DONE]');
        es.removeAllEventListeners();
        es.close();
        return;
      }
    } catch (err) {
      console.error(err);
      es.removeAllEventListeners();
      es.close();
    }
  };
  es.addEventListener('open', listener);
  es.addEventListener('message', listener);
  es.addEventListener('error', listener);
}

var USER_LABEL_DEFAULT = 'User';
var ASSISTANT_LABEL_DEFAULT = 'ChatGPT';
var ChatGPTAPI = class {
  constructor(opts) {
    const {
      apiKey,
      apiBaseUrl = 'https://api.openai.com',
      organization,
      debug = false,
      messageStore,
      completionParams,
      systemMessage,
      maxModelTokens = 4e3,
      maxResponseTokens = 1e3,
      getMessageById,
      upsertMessage,
      fetch: fetch2 = fetch,
    } = opts;
    this._apiKey = apiKey;
    this._apiBaseUrl = apiBaseUrl;
    this._organization = organization;
    this._debug = !!debug;
    this._fetch = fetch2;
    this._completionParams = {
      model: 'gpt-3.5-turbo-0301',
      temperature: 0.8,
      top_p: 1,
      presence_penalty: 1,
      ...completionParams,
    };
    this._systemMessage = systemMessage;
    if (this._systemMessage === void 0) {
      const currentDate = /* @__PURE__ */ new Date()
        .toISOString()
        .split('T')[0];
      this._systemMessage = `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.
Knowledge cutoff: 2021-09-01
Current date: ${currentDate}`;
    }
    this._maxModelTokens = maxModelTokens;
    this._maxResponseTokens = maxResponseTokens;
    this._getMessageById = getMessageById ?? this._defaultGetMessageById;
    this._upsertMessage = upsertMessage ?? this._defaultUpsertMessage;
    // if (messageStore) {
    //   this._messageStore = messageStore;
    // } else {
    //   this._messageStore = new Keyv({
    //     store: new QuickLRU({ maxSize: 1e4 }),
    //   });
    // }
    if (!this._apiKey) {
      throw new Error('OpenAI missing required apiKey');
    }
    if (!this._fetch) {
      throw new Error('Invalid environment; fetch is not defined');
    }
    if (typeof this._fetch !== 'function') {
      throw new Error('Invalid "fetch" is not a function');
    }
  }

  async sendMessage(text, opts = {}) {
    const {
      parentMessageId,
      messageId = uuid.v4(),
      timeoutMs,
      onProgress,
      onEvent,
      stream = onProgress ? true : false,
      completionParams,
    } = opts;
    let { abortSignal } = opts;
    let abortController = null;
    if (timeoutMs && !abortSignal) {
      abortController = new AbortController();
      abortSignal = abortController.signal;
    }
    const message = {
      role: 'user',
      id: messageId,
      parentMessageId,
      text,
    };
    await this._upsertMessage(message);
    const { messages } = await this._buildMessages(text, opts);
    const result = {
      role: 'assistant',
      id: uuid.v4(),
      parentMessageId: messageId,
      text: '',
    };
    const responseP = new Promise(async (resolve, reject) => {
      var _a, _b;
      const url = `${this._apiBaseUrl}/v1/chat/completions`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._apiKey}`,
      };
      if (this._organization) {
        headers['OpenAI-Organization'] = this._organization;
      }
      const body = {
        ...this._completionParams,
        ...completionParams,
        messages,
        stream,
      };
      if (stream) {
        fetchSSE(
          url,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            signal: abortSignal,
            onMessage: (data) => {
              var _a2;
              if (data === '[DONE]') {
                result.text = result.text.trim();
                return resolve(result);
              }
              try {
                const response = JSON.parse(data);
                if (response.id) {
                  result.id = response.id;
                }
                if (
                  (_a2 = response == null ? void 0 : response.choices) == null
                    ? void 0
                    : _a2.length
                ) {
                  const delta = response.choices[0].delta;
                  result.delta = delta.content;

                  if (delta == null ? void 0 : delta.content) {
                    result.text += delta.content;
                  }
                  result.detail = response;
                  if (delta.role) {
                    result.role = delta.role;
                  }
                  onProgress == null ? void 0 : onProgress(result);
                  if (result.delta?.length > 2 && result.delta.length < 5) {
                    // RNReactNativeHapticFeedback.trigger('soft', {
                    //   enableVibrateFallback: true,
                    //   ignoreAndroidSystemSettings: false,
                    // });
                  } else if (
                    result.delta?.length >= 5 &&
                    result.delta?.length < 10
                  ) {
                    // RNReactNativeHapticFeedback.trigger('impactLight', {
                    //   enableVibrateFallback: true,
                    //   ignoreAndroidSystemSettings: false,
                    // });
                  } else if (result.delta?.length >= 5) {
                    // RNReactNativeHapticFeedback.trigger('impactMedium', {
                    //   enableVibrateFallback: true,
                    //   ignoreAndroidSystemSettings: false,
                    // });
                  }
                }
              } catch (err) {
                console.warn('OpenAI stream SEE event unexpected error', err);
                return reject(err);
              }
            },
            eventSource: (data) => {
              onEvent == null ? void 0 : onEvent(data);
            },
          },
          this._fetch
        ).catch(reject);
      } else {
        try {
          const res = await this._fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            signal: abortSignal,
          });
          if (!res.ok) {
            const reason = await res.text();
            const msg = `OpenAI error ${res.status || res.statusText}: ${reason}`;
            const error = new ChatGPTError(msg, { cause: res });
            error.statusCode = res.status;
            error.statusText = res.statusText;
            return reject(error);
          }
          const response = await res.json();
          if (this._debug) {
            console.log(response);
          }
          if (response == null ? void 0 : response.id) {
            result.id = response.id;
          }
          if (
            (_a = response == null ? void 0 : response.choices) == null
              ? void 0
              : _a.length
          ) {
            const message2 = response.choices[0].message;
            result.text = message2.content;
            if (message2.role) {
              result.role = message2.role;
            }
          } else {
            const res2 = response;
            return reject(
              new Error(
                `OpenAI error: ${
                  ((_b = res2 == null ? void 0 : res2.detail) == null
                    ? void 0
                    : _b.message) ||
                  (res2 == null ? void 0 : res2.detail) ||
                  'unknown'
                }`
              )
            );
          }
          result.detail = response;
          return resolve(result);
        } catch (err) {
          return reject(err);
        }
      }
    }).then((message2) => {
      return this._upsertMessage(message2).then(() => message2);
    });
    if (timeoutMs) {
      if (abortController) {
        responseP.cancel = () => {
          abortController.abort();
        };
      }
      return pTimeout(responseP, {
        milliseconds: timeoutMs,
        message: 'OpenAI timed out waiting for response',
      });
    } else {
      return responseP;
    }
  }
  get apiKey() {
    return this._apiKey;
  }
  set apiKey(apiKey) {
    this._apiKey = apiKey;
  }
  async _buildMessages(text, opts) {
    const { systemMessage = this._systemMessage } = opts;
    let { parentMessageId } = opts;
    const userLabel = USER_LABEL_DEFAULT;
    const assistantLabel = ASSISTANT_LABEL_DEFAULT;
    let messages = [];
    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage,
      });
    }
    const systemMessageOffset = messages.length;
    let nextMessages = messages;

    const state = store.getState();
    const { chats } = state;
    chats.chats.map((chat, index) => {
      if (chat.user._id === 1) {
        nextMessages = nextMessages.concat([
          {
            role: 'user',
            content: chat.text,
            name: chat.name,
          },
        ]);
      } else {
        nextMessages = nextMessages.concat([
          {
            role: 'assistant',
            content: chat.text,
            name: chat.name,
          },
        ]);
      }
    });

    do {
      messages = nextMessages;
      if (!parentMessageId) {
        break;
      }
      const parentMessage = await this._getMessageById(parentMessageId);
      if (!parentMessage) {
        break;
      }
      const parentMessageRole = parentMessage.role || 'user';
      nextMessages = nextMessages.slice(0, systemMessageOffset).concat([
        {
          role: parentMessageRole,
          content: parentMessage.text,
          name: parentMessage.name,
        },
        ...nextMessages.slice(systemMessageOffset),
      ]);
      parentMessageId = parentMessage.parentMessageId;
    } while (true);
    return { messages };
  }
  async _defaultGetMessageById(id) {
    const res = await getStorage.get(id);
    return res;
  }
  async _defaultUpsertMessage(message) {}
};
export { ChatGPTAPI, ChatGPTError, openai };
