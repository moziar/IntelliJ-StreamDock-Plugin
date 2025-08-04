(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const streamdeck_typescript_1 = require("streamdeck-typescript");
const utils_1 = require("./utils");
const pluginName = 'com.jetbrains.idea';
class IdeaPI extends streamdeck_typescript_1.StreamDeckPropertyInspectorHandler {
    constructor() {
        super();
    }
    onDocumentLoaded() {
        var _a, _b;
        this.logMessage('onDocumentLoaded() ' + this.actionInfo.action);
        const runConfig = document.getElementById('run_config');
        this.initElements();
        (_a = this.saveElement) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.onSaveButtonPressed.bind(this));
        (_b = this.showTitleElement) === null || _b === void 0 ? void 0 : _b.addEventListener('change', this.onUpdateTitleButtonPressed.bind(this));
        switch (this.actionInfo.action) {
            case pluginName + '.run':
            case pluginName + '.debug': {
                runConfig.className = 'sdpi-item';
                break;
            }
        }
        document.querySelectorAll('[data-open-url]').forEach(e => {
            const value = e.getAttribute('data-open-url');
            if (value) {
                e === null || e === void 0 ? void 0 : e.addEventListener('click', () => {
                    this.openUrl(value);
                });
            }
            else {
                this.logMessage(`${value} is not a supported url`);
            }
        });
    }
    documentLoaded() {
        this.initElements();
    }
    initElements() {
        this.hostElement = document.getElementById('host');
        this.portElement = document.getElementById('port');
        this.passwordElement = document.getElementById('password');
        this.actionElement = document.getElementById('action');
        this.saveElement = document.getElementById('save');
        this.showTitleElement = document.getElementById('singlechk');
        this.runConfigurationNameElement = document.getElementById('run_config_name');
    }
    onSaveButtonPressed() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this.logMessage('onValidateButtonPressed()');
            const password = (_a = document.getElementById('password')) === null || _a === void 0 ? void 0 : _a.value;
            const host = (_b = this.hostElement) === null || _b === void 0 ? void 0 : _b.value;
            const port = (_c = this.portElement) === null || _c === void 0 ? void 0 : _c.value;
            const action = this.actionElement.value;
            const runConfig = this.runConfigurationNameElement.value;
            const showTitle = this.showTitleElement.checked ? "on" : "off";
            this.logMessage("action=" + action + ", showTitle=" + showTitle);
            this.settingsManager.setGlobalSettings({ password, host, port });
            switch (this.actionInfo.action) {
                case pluginName + '.empty.action': {
                    break;
                }
            }
            this.setSettings({
                action: action,
                showTitle,
                runConfig
            });
            this.requestSettings();
        });
    }
    onUpdateTitleButtonPressed() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logMessage('onUpdateTitleButtonPressed()');
            const showTitle = this.showTitleElement.checked ? "on" : "off";
            this.setSettings({
                showTitle
            });
        });
    }
    propertyInspectorDidAppear() {
        this.logMessage('propertyInspectorDidAppear()');
        this.requestSettings();
        const globalSettings = this.settingsManager.getGlobalSettings();
        if ((0, utils_1.isGlobalSettingsSet)(globalSettings)) {
            const password = globalSettings.password;
            if (password) {
                this.passwordElement.value = password;
            }
            const host = globalSettings.host;
            if (host) {
                this.hostElement.value = host;
            }
            const port = globalSettings.port;
            if (port) {
                this.portElement.value = port;
            }
        }
    }
    onReceiveSettings({ payload, }) {
        var _a, _b;
        this.logMessage("onReceiveSettings()");
        this.logMessage("payload.settings=" + JSON.stringify(payload.settings));
        this.logMessage("this.actionElement=" + this.actionElement);
        if (this.actionElement) {
            this.actionElement.value = (_a = payload.settings.action) !== null && _a !== void 0 ? _a : "";
        }
        if (this.showTitleElement) {
            this.showTitleElement.checked = ((_b = payload.settings.showTitle) !== null && _b !== void 0 ? _b : "off") === "on";
        }
        if (this.runConfigurationNameElement) {
            this.runConfigurationNameElement.value = payload.settings.runConfig !== undefined ? payload.settings.runConfig : "";
        }
    }
}
__decorate([
    (0, streamdeck_typescript_1.SDOnPiEvent)('documentLoaded')
], IdeaPI.prototype, "onDocumentLoaded", null);
__decorate([
    (0, streamdeck_typescript_1.SDOnPiEvent)('setupReady')
], IdeaPI.prototype, "documentLoaded", null);
__decorate([
    (0, streamdeck_typescript_1.SDOnPiEvent)('globalSettingsAvailable')
], IdeaPI.prototype, "propertyInspectorDidAppear", null);
__decorate([
    (0, streamdeck_typescript_1.SDOnPiEvent)('didReceiveSettings')
], IdeaPI.prototype, "onReceiveSettings", null);
new IdeaPI();

},{"./utils":2,"streamdeck-typescript":13}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJetBrainsIDE = exports.fetchApi = exports.isGlobalSettingsSet = void 0;
function isGlobalSettingsSet(settings) {
    const globalSettings = settings;
    return globalSettings.host !== undefined || globalSettings.port !== undefined;
}
exports.isGlobalSettingsSet = isGlobalSettingsSet;
function fetchApi({ body, endpoint, method, accessToken }) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (yield fetch(`http://localhost:21420${endpoint}`, {
            method,
            body,
        })).json();
    });
}
exports.fetchApi = fetchApi;
function fetchJetBrainsIDE({ body, endpoint, method, password, host, port }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (port !== undefined && port !== null && port !== '') {
            try {
                fetch(`http://${host}:${port}${endpoint}`, {
                    method,
                    headers: {
                        Authorization: `${password}`,
                    },
                    body,
                }).catch(err => console.log('fetchJetBrainsIDE Failed', err.message));
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            for (let i = 63342; i <= 63352; i++) {
                console.log(`fetch http://${host}:${i}${endpoint}`);
                try {
                    fetch(`http://${host}:${i}${endpoint}`, {
                        method,
                        headers: {
                            Authorization: `${password}`,
                        },
                        body,
                    })
                        .catch(err => console.log('fetchJetBrainsIDE Failed', err.message));
                }
                catch (e) {
                    console.log("fetchJetBrainsIDE failed:" + e);
                }
            }
        }
    });
}
exports.fetchJetBrainsIDE = fetchJetBrainsIDE;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDeckPropertyInspectorHandler = exports.StreamDeckPluginHandler = exports.StreamDeckHandlerBase = exports.StreamDeckAction = void 0;
const stream_deck_action_1 = require("./stream-deck-action");
Object.defineProperty(exports, "StreamDeckAction", { enumerable: true, get: function () { return stream_deck_action_1.StreamDeckAction; } });
const stream_deck_handler_base_1 = require("./stream-deck-handler-base");
Object.defineProperty(exports, "StreamDeckHandlerBase", { enumerable: true, get: function () { return stream_deck_handler_base_1.StreamDeckHandlerBase; } });
const stream_deck_plugin_handler_1 = require("./stream-deck-plugin-handler");
Object.defineProperty(exports, "StreamDeckPluginHandler", { enumerable: true, get: function () { return stream_deck_plugin_handler_1.StreamDeckPluginHandler; } });
const stream_deck_property_inspector_handler_1 = require("./stream-deck-property-inspector-handler");
Object.defineProperty(exports, "StreamDeckPropertyInspectorHandler", { enumerable: true, get: function () { return stream_deck_property_inspector_handler_1.StreamDeckPropertyInspectorHandler; } });

},{"./stream-deck-action":4,"./stream-deck-handler-base":5,"./stream-deck-plugin-handler":6,"./stream-deck-property-inspector-handler":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDeckAction = void 0;
class StreamDeckAction {
    constructor(plugin, actionName) {
        if (this._sd_events)
            for (let event of this._sd_events)
                event(actionName, this);
    }
}
exports.StreamDeckAction = StreamDeckAction;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDeckHandlerBase = void 0;
const event_manager_1 = require("../manager/event.manager");
const settings_manager_1 = require("../manager/settings.manager");
class StreamDeckHandlerBase {
    constructor() {
        this._documentReady = false;
        this._connectionReady = false;
        this._globalSettingsReady = false;
        this._documentReadyInvoked = false;
        this._connectionReadyInvoked = false;
        this._globalSettingsInvoked = false;
        this._onReadyInvoked = false;
        this._debug = false;
        this._cachedEvents = [];
        this._settingsManager = new settings_manager_1.SettingsManager(this);
        this._eventManager = event_manager_1.EventManager.INSTANCE;
        if (this._sd_events)
            for (let event of this._sd_events)
                event('*', this);
        window.connectElgatoStreamDeckSocket = (port, uuid, registerEvent, info, actionInfo) => {
            this._port = port;
            this._uuid = uuid;
            this._registerEvent = registerEvent;
            this._info = JSON.parse(info);
            if (actionInfo) {
                this._eventManager.callEvents('registerPi', '*', actionInfo);
            }
            this._connectElgatoStreamDeckSocket();
            this._docReady(() => {
                this._documentReady = true;
                this._handleReadyState();
            });
        };
    }
    get port() {
        return this._port;
    }
    get uuid() {
        return this._uuid;
    }
    get registerEvent() {
        return this._registerEvent;
    }
    get info() {
        return this._info;
    }
    get settingsManager() {
        return this._settingsManager;
    }
    get documentReady() {
        return this._documentReady;
    }
    get connectionReady() {
        return this._connectionReady;
    }
    get globalSettingsReady() {
        return this._globalSettingsReady;
    }
    setSettings(settings, context) {
        this.send('setSettings', {
            context: context,
            payload: settings,
        });
    }
    requestSettings(context) {
        this.send('getSettings', {
            context: context,
        });
    }
    setGlobalSettings(settings) {
        this.send('setGlobalSettings', {
            context: this._uuid,
            payload: settings,
        });
    }
    requestGlobalSettings() {
        this.send('getGlobalSettings', {
            context: this._uuid,
        });
    }
    openUrl(url) {
        this.send('openUrl', {
            payload: { url },
        });
    }
    logMessage(message) {
        this.send('logMessage', {
            payload: { message },
        });
    }
    send(event, data) {
        const eventToSend = Object.assign({ event }, data);
        if (this._debug)
            console.log(`SEND ${event}`, eventToSend, this._ws);
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(JSON.stringify(eventToSend));
        } else {
            if (this._debug)
                console.error('COULD NOT SEND. CACHING FOR RESEND EVENT');
            this._cachedEvents.push(JSON.stringify(eventToSend));
        }
    }
    enableDebug() {
        this._debug = true;
    }
    _docReady(fn) {
        if (document.readyState === 'complete' ||
            document.readyState === 'interactive') {
            setTimeout(() => fn(), 1);
        }
        else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    _connectElgatoStreamDeckSocket() {
        this._ws = new WebSocket('ws://127.0.0.1:' + this._port);
        this._ws.onopen = () => this._open();
        this._ws.onclose = () => {
            this._eventManager.callEvents('connectionClosed');
        };
        this._ws.onmessage = (ev) => this._eventHandler(ev);
    }
    _open() {
        this.send(this._registerEvent, { uuid: this._uuid });
        if (this._cachedEvents.length >= 1) {
            if (this._debug)
                console.log('RESENDING CACHED EVENTS: ', this._cachedEvents);
            for (let cachedEvent of this._cachedEvents) {
                if (this._ws && this._ws.readyState === WebSocket.OPEN) {
                    this._ws.send(cachedEvent);
                }
            }
        }
        this._connectionReady = true;
        this._handleReadyState();
        this.requestGlobalSettings();
    }
    _handleReadyState() {
        if (this._connectionReady && !this._connectionReadyInvoked) {
            this._connectionReadyInvoked = true;
            this._eventManager.callEvents('connectionOpened');
        }
        if (this._documentReady && !this._documentReadyInvoked) {
            this._documentReadyInvoked = true;
            this._eventManager.callEvents('documentLoaded');
        }
        if (this._globalSettingsReady && !this._globalSettingsInvoked) {
            this._globalSettingsInvoked = true;
            this._eventManager.callEvents('globalSettingsAvailable', '*', this.settingsManager);
        }
        if (this._globalSettingsInvoked &&
            this._documentReadyInvoked &&
            this._connectionReadyInvoked &&
            !this._onReadyInvoked) {
            this._onReadyInvoked = true;
            this._eventManager.callEvents('setupReady');
        }
    }
    _eventHandler(ev) {
        var _a;
        const eventData = JSON.parse(ev.data);
        const event = eventData.event;
        if (this._debug)
            console.log(`RECEIVE ${event}`, eventData, ev);
        if (event === 'didReceiveGlobalSettings') {
            this.settingsManager.cacheGlobalSettings(eventData.payload.settings);
            this._globalSettingsReady = true;
            this._handleReadyState();
        }
        this._eventManager.callEvents(event, (_a = eventData.action) !== null && _a !== void 0 ? _a : '*', eventData);
    }
}
exports.StreamDeckHandlerBase = StreamDeckHandlerBase;

},{"../manager/event.manager":17,"../manager/settings.manager":18}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDeckPluginHandler = void 0;
const stream_deck_action_class_1 = require("../classes/stream-deck-action.class");
const enums_1 = require("../interfaces/enums");
const action_manager_1 = require("../manager/action.manager");
const stream_deck_handler_base_1 = require("./stream-deck-handler-base");
class StreamDeckPluginHandler extends stream_deck_handler_base_1.StreamDeckHandlerBase {
    constructor() {
        super();
        this._actionManager = new action_manager_1.ActionManager(this);
    }
    get actionManager() {
        return this._actionManager;
    }
    setTitle(title, context, target = enums_1.TargetType.BOTH, state) {
        if (state) {
            this.send('setTitle', {
                context,
                payload: { title, target, state },
            });
        }
        else {
            this.send('setTitle', {
                context,
                payload: { title, target },
            });
        }
    }
    setImage(image, context, target = enums_1.TargetType.BOTH, state) {
        if (state) {
            this.send('setImage', {
                context,
                payload: { image, target, state },
            });
        }
        else {
            this.send('setImage', {
                context,
                payload: { image, target },
            });
        }
    }
    setImageFromUrl(url, context, target = enums_1.TargetType.BOTH, state) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () => {
                let canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                let ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('image failed to load'));
                    return;
                }
                ctx.drawImage(image, 0, 0);
                image.onload = null;
                image.onerror = null;
                image = null;
                const dataUrl = canvas.toDataURL('image/png');
                this.setImage(dataUrl, context, target, state);
                resolve(dataUrl);
            };
            image.onerror = () => {
                image.onload = null;
                image.onerror = null;
                image = null;
                reject(new Error('image failed to load'));
            };
            image.src = url;
        });
    }
    showAlert(context) {
        this.send('showAlert', { context });
    }
    showOk(context) {
        this.send('showOk', { context });
    }
    setState(state, context) {
        this.send('setState', {
            context: context,
            payload: { state },
        });
    }
    switchToProfile(profile, device) {
        this.send('switchToProfile', {
            context: this.uuid,
            device: device ? device : this.info.devices[0].id,
            payload: { profile },
        });
    }
    sendToPropertyInspector(payload, action, context) {
        this.send('sendToPropertyInspector', {
            context,
            action: action,
            payload,
        });
    }
    _eventHandler(ev) {
        var _a, _b, _c;
        const eventData = JSON.parse(ev.data);
        const event = eventData.event;
        if (event !== 'didReceiveGlobalSettings' &&
            eventData.context &&
            ((_a = eventData.payload) === null || _a === void 0 ? void 0 : _a.settings))
            this.settingsManager.cacheContextSettings(eventData.context, eventData.payload.settings);
        let settings, column, isInMultiAction, row, state, userDesiredState, action, context, device;
        action = eventData === null || eventData === void 0 ? void 0 : eventData.action;
        context = eventData === null || eventData === void 0 ? void 0 : eventData.context;
        device = eventData === null || eventData === void 0 ? void 0 : eventData.device;
        const payload = eventData === null || eventData === void 0 ? void 0 : eventData.payload;
        settings = payload === null || payload === void 0 ? void 0 : payload.settings;
        state = payload === null || payload === void 0 ? void 0 : payload.state;
        userDesiredState = payload === null || payload === void 0 ? void 0 : payload.userDesiredState;
        isInMultiAction = payload === null || payload === void 0 ? void 0 : payload.isInMultiAction;
        column = (_b = payload === null || payload === void 0 ? void 0 : payload.coordinates) === null || _b === void 0 ? void 0 : _b.column;
        row = (_c = payload === null || payload === void 0 ? void 0 : payload.coordinates) === null || _c === void 0 ? void 0 : _c.row;
        const actionClass = this._actionManager.addOrGetAction(context, new stream_deck_action_class_1.StreamDeckActionClass(this));
        if (actionClass) {
            if (action !== undefined)
                actionClass.action = action;
            if (context !== undefined)
                actionClass.context = context;
            if (device !== undefined)
                actionClass.device = device;
            if (settings !== undefined)
                actionClass.settings = settings;
            if (column !== undefined)
                actionClass.column = column;
            if (row !== undefined)
                actionClass.row = row;
            if (state !== undefined)
                actionClass.state = state;
            if (userDesiredState !== undefined)
                actionClass.userDesiredState = userDesiredState;
            if (isInMultiAction !== undefined)
                actionClass.isInMultiAction = isInMultiAction;
        }
        super._eventHandler(ev);
    }
}
exports.StreamDeckPluginHandler = StreamDeckPluginHandler;

},{"../classes/stream-deck-action.class":8,"../interfaces/enums":14,"../manager/action.manager":16,"./stream-deck-handler-base":5}],7:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDeckPropertyInspectorHandler = void 0;
const on_pi_event_decorator_1 = require("../decorators/on-pi-event.decorator");
const stream_deck_handler_base_1 = require("./stream-deck-handler-base");
class StreamDeckPropertyInspectorHandler extends stream_deck_handler_base_1.StreamDeckHandlerBase {
    get actionInfo() {
        return this._actionInfo;
    }
    sendToPlugin(payload, action) {
        var _a;
        this.send('sendToPlugin', {
            context: this.uuid,
            action: action ? action : (_a = this._actionInfo) === null || _a === void 0 ? void 0 : _a.action,
            payload,
        });
    }
    requestSettings() {
        super.requestSettings(this.uuid);
    }
    setSettings(settings) {
        super.setSettings(settings, this.uuid);
    }
    onRegisterPi(actionInfo) {
        this._actionInfo = JSON.parse(actionInfo);
        this.requestSettings();
    }
}
__decorate([
    on_pi_event_decorator_1.SDOnPiEvent('registerPi')
], StreamDeckPropertyInspectorHandler.prototype, "onRegisterPi", null);
exports.StreamDeckPropertyInspectorHandler = StreamDeckPropertyInspectorHandler;

},{"../decorators/on-pi-event.decorator":11,"./stream-deck-handler-base":5}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDeckActionClass = void 0;
class StreamDeckActionClass {
    constructor(_handler) {
        this._handler = _handler;
        this._autoSave = true;
        this._autoDebounce = true;
        this._isInMultiAction = false;
    }
    set settings(value) {
        this._settings = value;
    }
    get action() {
        return this._action;
    }
    set action(value) {
        this._action = value;
    }
    get context() {
        return this._context;
    }
    set context(value) {
        this._context = value;
    }
    get device() {
        return this._device;
    }
    set device(value) {
        this._device = value;
    }
    get column() {
        return this._column;
    }
    set column(value) {
        this._column = value;
    }
    get row() {
        return this._row;
    }
    set row(value) {
        this._row = value;
    }
    get isInMultiAction() {
        return this._isInMultiAction;
    }
    set isInMultiAction(value) {
        this._isInMultiAction = value;
    }
    get state() {
        return this._state;
    }
    set state(value) {
        this._state = value;
    }
    get userDesiredState() {
        return this._userDesiredState;
    }
    set userDesiredState(value) {
        this._userDesiredState = value;
    }
    disableAutoSave() {
        this._autoSave = false;
    }
    disableAutoDebounce() {
        this._autoDebounce = false;
    }
    enableAutoSave() {
        this._autoSave = true;
    }
    enableAutoDebounce() {
        this._autoDebounce = true;
    }
    getSettings() {
        return this._settings;
    }
    getAction() {
        return this._action;
    }
    getContext() {
        return this._context;
    }
    getDevice() {
        return this._device;
    }
    setSettings(settings, ms = 0) {
        this._settings = settings;
        if (this._autoSave)
            this.saveSettings(ms);
    }
    setSettingsAttributes(attributes, ms = 0) {
        const oldSettings = this.getSettings();
        if (oldSettings)
            this.setSettings(Object.assign(Object.assign({}, oldSettings), attributes), ms);
        else
            this.setSettings(Object.assign({}, attributes), ms);
    }
    saveSettings(ms) {
        const fn = () => {
            this._handler.setSettings(this._settings, this._context);
        };
        if (this._autoDebounce) {
            this.debounceSettingsCall(fn, ms);
        }
        else {
            fn();
        }
    }
    debounceSettingsCall(fn, ms) {
        clearTimeout(this._settingsTimeoutId);
        this._settingsTimeoutId = setTimeout(fn, ms);
    }
    update(self) {
        const { _action, _autoDebounce, _autoSave, _handler, _column, _context, _device, _isInMultiAction, _row, _settings, _state, _userDesiredState, } = self;
        this._action = _action !== null && _action !== void 0 ? _action : this._action;
        this._autoDebounce = _autoDebounce !== null && _autoDebounce !== void 0 ? _autoDebounce : this._autoDebounce;
        this._autoSave = _autoSave !== null && _autoSave !== void 0 ? _autoSave : this._autoSave;
        this._handler = _handler !== null && _handler !== void 0 ? _handler : this._handler;
        this._column = _column !== null && _column !== void 0 ? _column : this._column;
        this._context = _context !== null && _context !== void 0 ? _context : this._context;
        this._device = _device !== null && _device !== void 0 ? _device : this._device;
        this._isInMultiAction = _isInMultiAction !== null && _isInMultiAction !== void 0 ? _isInMultiAction : this._isInMultiAction;
        this._row = _row !== null && _row !== void 0 ? _row : this._row;
        this._settings = _settings !== null && _settings !== void 0 ? _settings : this._settings;
        this._state = _state !== null && _state !== void 0 ? _state : this._state;
        this._userDesiredState = _userDesiredState !== null && _userDesiredState !== void 0 ? _userDesiredState : this._userDesiredState;
    }
}
exports.StreamDeckActionClass = StreamDeckActionClass;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDOnPiEvent = exports.SDOnActionEvent = void 0;
const on_action_event_decorator_1 = require("./on-action-event.decorator");
Object.defineProperty(exports, "SDOnActionEvent", { enumerable: true, get: function () { return on_action_event_decorator_1.SDOnActionEvent; } });
const on_pi_event_decorator_1 = require("./on-pi-event.decorator");
Object.defineProperty(exports, "SDOnPiEvent", { enumerable: true, get: function () { return on_pi_event_decorator_1.SDOnPiEvent; } });

},{"./on-action-event.decorator":10,"./on-pi-event.decorator":11}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDOnActionEvent = void 0;
const event_manager_1 = require("../manager/event.manager");
function SDOnActionEvent(event) {
    return (target, propertyKey, descriptor) => {
        return event_manager_1.EventManager.DefaultDecoratorEventListener(event, target, propertyKey, descriptor);
    };
}
exports.SDOnActionEvent = SDOnActionEvent;

},{"../manager/event.manager":17}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDOnPiEvent = void 0;
const event_manager_1 = require("../manager/event.manager");
function SDOnPiEvent(event) {
    return (target, propertyKey, descriptor) => {
        return event_manager_1.EventManager.DefaultDecoratorEventListener(event, target, propertyKey, descriptor);
    };
}
exports.SDOnPiEvent = SDOnPiEvent;

},{"../manager/event.manager":17}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalArgumentError = void 0;
class IllegalArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IllegalArgumentError';
    }
}
exports.IllegalArgumentError = IllegalArgumentError;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDeckActionClass = exports.ActionManager = exports.SettingsManager = exports.EventManager = exports.EventType = exports.StateType = exports.TargetType = exports.DeviceType = exports.StreamDeckPropertyInspectorHandler = exports.StreamDeckPluginHandler = exports.StreamDeckHandlerBase = exports.StreamDeckAction = exports.SDOnPiEvent = exports.SDOnActionEvent = void 0;
const abstracts_1 = require("./abstracts/abstracts");
Object.defineProperty(exports, "StreamDeckAction", { enumerable: true, get: function () { return abstracts_1.StreamDeckAction; } });
Object.defineProperty(exports, "StreamDeckHandlerBase", { enumerable: true, get: function () { return abstracts_1.StreamDeckHandlerBase; } });
Object.defineProperty(exports, "StreamDeckPluginHandler", { enumerable: true, get: function () { return abstracts_1.StreamDeckPluginHandler; } });
Object.defineProperty(exports, "StreamDeckPropertyInspectorHandler", { enumerable: true, get: function () { return abstracts_1.StreamDeckPropertyInspectorHandler; } });
const stream_deck_action_class_1 = require("./classes/stream-deck-action.class");
Object.defineProperty(exports, "StreamDeckActionClass", { enumerable: true, get: function () { return stream_deck_action_class_1.StreamDeckActionClass; } });
const decorators_1 = require("./decorators/decorators");
Object.defineProperty(exports, "SDOnActionEvent", { enumerable: true, get: function () { return decorators_1.SDOnActionEvent; } });
Object.defineProperty(exports, "SDOnPiEvent", { enumerable: true, get: function () { return decorators_1.SDOnPiEvent; } });
const interfaces_1 = require("./interfaces/interfaces");
Object.defineProperty(exports, "DeviceType", { enumerable: true, get: function () { return interfaces_1.DeviceType; } });
Object.defineProperty(exports, "EventType", { enumerable: true, get: function () { return interfaces_1.EventType; } });
Object.defineProperty(exports, "StateType", { enumerable: true, get: function () { return interfaces_1.StateType; } });
Object.defineProperty(exports, "TargetType", { enumerable: true, get: function () { return interfaces_1.TargetType; } });
const action_manager_1 = require("./manager/action.manager");
Object.defineProperty(exports, "ActionManager", { enumerable: true, get: function () { return action_manager_1.ActionManager; } });
const event_manager_1 = require("./manager/event.manager");
Object.defineProperty(exports, "EventManager", { enumerable: true, get: function () { return event_manager_1.EventManager; } });
const settings_manager_1 = require("./manager/settings.manager");
Object.defineProperty(exports, "SettingsManager", { enumerable: true, get: function () { return settings_manager_1.SettingsManager; } });

},{"./abstracts/abstracts":3,"./classes/stream-deck-action.class":8,"./decorators/decorators":9,"./interfaces/interfaces":15,"./manager/action.manager":16,"./manager/event.manager":17,"./manager/settings.manager":18}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.StateType = exports.TargetType = exports.DeviceType = void 0;
var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["StreamDeck"] = 0] = "StreamDeck";
    DeviceType[DeviceType["StreamDeckMini"] = 1] = "StreamDeckMini";
    DeviceType[DeviceType["StreamDeckXL"] = 2] = "StreamDeckXL";
    DeviceType[DeviceType["StreamDeckMobile"] = 3] = "StreamDeckMobile";
    DeviceType[DeviceType["CorsairGKeys"] = 4] = "CorsairGKeys";
})(DeviceType = exports.DeviceType || (exports.DeviceType = {}));
var TargetType;
(function (TargetType) {
    TargetType[TargetType["BOTH"] = 0] = "BOTH";
    TargetType[TargetType["HARDWARE"] = 1] = "HARDWARE";
    TargetType[TargetType["SOFTWARE"] = 2] = "SOFTWARE";
})(TargetType = exports.TargetType || (exports.TargetType = {}));
var StateType;
(function (StateType) {
    StateType[StateType["ON"] = 0] = "ON";
    StateType[StateType["OFF"] = 1] = "OFF";
})(StateType = exports.StateType || (exports.StateType = {}));
var EventType;
(function (EventType) {
    EventType[EventType["ALL"] = 0] = "ALL";
    EventType[EventType["PI"] = 1] = "PI";
    EventType[EventType["PLUGIN"] = 2] = "PLUGIN";
    EventType[EventType["NONE"] = 3] = "NONE";
})(EventType = exports.EventType || (exports.EventType = {}));

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.StateType = exports.TargetType = exports.DeviceType = void 0;
const enums_1 = require("./enums");
Object.defineProperty(exports, "DeviceType", { enumerable: true, get: function () { return enums_1.DeviceType; } });
Object.defineProperty(exports, "EventType", { enumerable: true, get: function () { return enums_1.EventType; } });
Object.defineProperty(exports, "StateType", { enumerable: true, get: function () { return enums_1.StateType; } });
Object.defineProperty(exports, "TargetType", { enumerable: true, get: function () { return enums_1.TargetType; } });

},{"./enums":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionManager = void 0;
class ActionManager {
    constructor(_handler) {
        this._handler = _handler;
        this._actions = new Map();
    }
    getAction(context) {
        return this._actions.get(context);
    }
    addOrGetAction(context, action) {
        if (!this.getAction(context))
            this._actions.set(context, action);
        return this.getAction(context);
    }
}
exports.ActionManager = ActionManager;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
const illegal_argument_error_1 = require("../errors/illegal-argument.error");
class EventManager {
    constructor() {
        this.registeredEvents = new Map();
    }
    static get INSTANCE() {
        if (!this._INSTANCE)
            this._INSTANCE = new EventManager();
        return this._INSTANCE;
    }
    static DefaultDecoratorEventListener(event, target, propertyKey, descriptor) {
        const eventListener = (actionName, instance) => {
            if (typeof actionName !== 'string') {
                throw new illegal_argument_error_1.IllegalArgumentError(`actionName needs to be of type string but ${typeof actionName} given.`);
            }
            EventManager.INSTANCE.registerEvent(event, (eventActionName, ...params) => {
                if (!eventActionName ||
                    actionName === '*' ||
                    eventActionName === '*' ||
                    actionName === eventActionName)
                    descriptor.value.apply(instance, params);
            });
        };
        if (!target._sd_events) {
            target._sd_events = [];
        }
        target._sd_events.push(eventListener);
        return descriptor;
    }
    registerEvent(eventName, callback) {
        var _a;
        if (!this.registeredEvents.has(eventName))
            this.registeredEvents.set(eventName, []);
        (_a = this.registeredEvents.get(eventName)) === null || _a === void 0 ? void 0 : _a.push(callback);
    }
    callEvents(eventName, actionName = '*', ...params) {
        var _a;
        (_a = this.registeredEvents
            .get(eventName)) === null || _a === void 0 ? void 0 : _a.forEach((val) => val(actionName, ...params));
    }
}
exports.EventManager = EventManager;

},{"../errors/illegal-argument.error":12}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsManager = void 0;
class SettingsManager {
    constructor(_handler) {
        this._handler = _handler;
        this._settings = new Map();
        this._globalSettings = {};
        this._autoSave = true;
        this._autoDebounce = true;
        this.contextSettingsTimeoutIds = {};
    }
    disableAutoSave() {
        this._autoSave = false;
    }
    disableAutoDebounce() {
        this._autoDebounce = false;
    }
    getGlobalSettings() {
        return this._globalSettings;
    }
    setGlobalSettings(settings, ms = 0) {
        this._globalSettings = settings;
        if (this._autoSave)
            this.saveGlobalSettings(ms);
    }
    setGlobalSettingsAttributes(attributes, ms = 0) {
        this.setGlobalSettings(Object.assign(Object.assign({}, this.getGlobalSettings()), attributes));
    }
    getContextSettings(context) {
        return this._settings.get(context);
    }
    getAllContextSettings() {
        return this._settings;
    }
    setContextSettings(context, settings, ms = 0) {
        this._settings.set(context, settings);
        if (this._autoSave)
            this.saveContextSettings(context, ms);
    }
    setContextSettingsAttributes(context, attributes, ms = 0) {
        const oldSettings = this.getContextSettings(context);
        if (oldSettings)
            this.setContextSettings(context, Object.assign(Object.assign({}, oldSettings), attributes), ms);
        else
            this.setContextSettings(context, Object.assign({}, attributes), ms);
    }
    saveGlobalSettings(ms) {
        const fn = () => {
            this._handler.setGlobalSettings(this._globalSettings);
        };
        if (this._autoDebounce) {
            this.debounceGlobalSettingsCall(fn, ms);
        }
        else {
            fn();
        }
    }
    saveContextSettings(context, ms) {
        const fn = () => {
            if (context === 'ALL') {
                for (let [context, setting] of this._settings) {
                    this._handler.setSettings(setting, context);
                }
            }
            else if (this._settings.get(context)) {
                this._handler.setSettings(this._settings.get(context), context);
            }
        };
        if (this._autoDebounce) {
            this.debounceContextSettingsCall(context, fn, ms);
        }
        else {
            fn();
        }
    }
    cacheGlobalSettings(settings) {
        this._globalSettings = settings;
    }
    cacheContextSettings(context, settings) {
        this._settings.set(context, settings);
    }
    debounceGlobalSettingsCall(fn, ms) {
        clearTimeout(this.globalSettingsTimeoutId);
        this.globalSettingsTimeoutId = setTimeout(fn, ms);
    }
    debounceContextSettingsCall(context, fn, ms) {
        clearTimeout(this.contextSettingsTimeoutIds[context]);
        this.contextSettingsTimeoutIds[context] = setTimeout(fn, ms);
    }
}
exports.SettingsManager = SettingsManager;

},{}]},{},[1]);
