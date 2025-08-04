(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionIdBrowserAction = void 0;
const default_action_1 = require("./default-action");
class ActionIdBrowserAction extends default_action_1.DefaultAction {
    actionId() {
        return "streamdeck.show.action.browser";
    }
    actionTitle() {
        return "Action\n Browser";
    }
}
exports.ActionIdBrowserAction = ActionIdBrowserAction;

},{"./default-action":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugAction = void 0;
const default_action_1 = require("./default-action");
class DebugAction extends default_action_1.DefaultAction {
    actionId() {
        return "Debug";
    }
}
exports.DebugAction = DebugAction;

},{"./default-action":3}],3:[function(require,module,exports){
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
exports.DefaultAction = void 0;
const streamdeck_typescript_1 = require("streamdeck-typescript");
const utils_1 = require("../utils");
class DefaultAction extends streamdeck_typescript_1.StreamDeckAction {
    constructor(plugin, actionName) {
        super(plugin, actionName);
        this.plugin = plugin;
        console.log(`Initialized ${actionName}`);
    }
    actionTitle() {
        return this.actionId();
    }
    onKeyUp({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('onKeyUp() actionId=' + this.actionId());
            let action = payload.settings.action;
            let runConfig = payload.settings.runConfig;
            console.log('onKeyUp() customAction=' + action);
            if (action == null || action === '') {
                action = this.actionId();
            }
            if (action == null || action === '') {
                // 如果actionId为空，则显示警告并返回
                console.warn('No action ID defined for this button');
                if (this.context != null) {
                    this.plugin.showAlert(this.context);
                }
                return;
            }
            const globalSettings = this.plugin.settingsManager.getGlobalSettings();
            let host = '127.0.0.1';
            let password = '';
            let port = '';
            if ((0, utils_1.isGlobalSettingsSet)(globalSettings)) {
                host = globalSettings.host;
            }
            if (host === undefined || host === '') {
                host = '127.0.0.1';
            }
            if (globalSettings !== undefined) {
                const settings = globalSettings;
                password = settings.password;
                port = settings.port;
            }
            let endpoint = `/api/action/${action}`;
            if (runConfig == null || runConfig === undefined) {
                runConfig = '';
            }
            console.log('runConfig=' + runConfig);
            if (runConfig !== '') {
                endpoint += '?name=' + encodeURIComponent(runConfig);
            }
            yield (0, utils_1.fetchJetBrainsIDE)({
                endpoint: endpoint,
                port: port,
                password: password,
                accessToken: '',
                host: host,
                method: 'GET',
            });
        });
    }
    onContextAppear({ context, payload }) {
        console.log('onContextAppear() actionId=' + this.actionId() + " context=" + context);
        this.context = context;
        this.readCustomActionTitle(payload.settings);
        this.toggleTitleVisible();
    }
    readCustomActionTitle(settings) {
        let actionTitle = settings.action;
        if (actionTitle == null || actionTitle === '') {
            actionTitle = this.actionTitle();
        }
        if (actionTitle == null || actionTitle === '') {
            actionTitle = this.actionId();
        }
        this.customTitle = actionTitle;
    }
    toggleTitleVisible() {
        if (this.showTitle !== "on" && this.context != undefined) {
            this.plugin.setTitle("", this.context);
        }
        else if (this.context != undefined) {
            if (this.customTitle == null || this.customTitle === '') {
                this.plugin.setTitle("", this.context);
                return;
            }
            else {
                this.plugin.setTitle(this.customTitle, this.context);
            }
        }
    }
    onContextDisappear(event) {
    }
    onSendToPluginEvent({ context, payload }) {
        console.log('onSendToPluginEvent() payload.showTitle=' + payload.showTitle);
    }
    onSettings({ context, payload: { settings } }) {
        console.log('onSettings() settings.action=' + settings.action);
        console.log('onSettings() settings.showTitle=' + settings.showTitle);
        this.showTitle = settings.showTitle;
        this.readCustomActionTitle(settings);
        this.toggleTitleVisible();
    }
    onReceiveGlobalSettings({ payload: { settings } }) {
    }
}
__decorate([
    (0, streamdeck_typescript_1.SDOnActionEvent)('keyUp')
], DefaultAction.prototype, "onKeyUp", null);
__decorate([
    (0, streamdeck_typescript_1.SDOnActionEvent)('willAppear')
], DefaultAction.prototype, "onContextAppear", null);
__decorate([
    (0, streamdeck_typescript_1.SDOnActionEvent)('willDisappear')
], DefaultAction.prototype, "onContextDisappear", null);
__decorate([
    (0, streamdeck_typescript_1.SDOnActionEvent)('sendToPlugin')
], DefaultAction.prototype, "onSendToPluginEvent", null);
__decorate([
    (0, streamdeck_typescript_1.SDOnActionEvent)('didReceiveSettings')
], DefaultAction.prototype, "onSettings", null);
__decorate([
    (0, streamdeck_typescript_1.SDOnActionEvent)('didReceiveGlobalSettings')
], DefaultAction.prototype, "onReceiveGlobalSettings", null);
exports.DefaultAction = DefaultAction;

},{"../utils":17,"streamdeck-typescript":28}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyAction = void 0;
const default_action_1 = require("./default-action");
class EmptyAction extends default_action_1.DefaultAction {
    actionId() {
        return "com.jetbrains.idea.empty.action";
    }
}
exports.EmptyAction = EmptyAction;

},{"./default-action":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitPullAction = void 0;
const default_action_1 = require("./default-action");
class GitPullAction extends default_action_1.DefaultAction {
    actionId() {
        return "Vcs.UpdateProject";
    }
    actionTitle() {
        return "VCS\nUpdate";
    }
}
exports.GitPullAction = GitPullAction;

},{"./default-action":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewProjectAction = void 0;
const default_action_1 = require("./default-action");
class NewProjectAction extends default_action_1.DefaultAction {
    actionId() {
        return "NewProject";
    }
    actionTitle() {
        return "New\nProject";
    }
}
exports.NewProjectAction = NewProjectAction;

},{"./default-action":3}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PauseAction = void 0;
const default_action_1 = require("./default-action");
class PauseAction extends default_action_1.DefaultAction {
    actionId() {
        return "Pause";
    }
}
exports.PauseAction = PauseAction;

},{"./default-action":3}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowProjectStructureAction = void 0;
const default_action_1 = require("./default-action");
class ShowProjectStructureAction extends default_action_1.DefaultAction {
    actionId() {
        return "ShowProjectStructureSettings";
    }
    actionTitle() {
        return "Project\nStructure";
    }
}
exports.ShowProjectStructureAction = ShowProjectStructureAction;

},{"./default-action":3}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeAction = void 0;
const default_action_1 = require("./default-action");
class ResumeAction extends default_action_1.DefaultAction {
    actionId() {
        return "Resume";
    }
}
exports.ResumeAction = ResumeAction;

},{"./default-action":3}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunAction = void 0;
const default_action_1 = require("./default-action");
class RunAction extends default_action_1.DefaultAction {
    actionId() {
        return "Run";
    }
}
exports.RunAction = RunAction;

},{"./default-action":3}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEverywhereAction = void 0;
const default_action_1 = require("./default-action");
class SearchEverywhereAction extends default_action_1.DefaultAction {
    actionId() {
        return "SearchEverywhere";
    }
    actionTitle() {
        return "Search\nEverywhere";
    }
}
exports.SearchEverywhereAction = SearchEverywhereAction;

},{"./default-action":3}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepIntoAction = void 0;
const default_action_1 = require("./default-action");
class StepIntoAction extends default_action_1.DefaultAction {
    actionId() {
        return "StepInto";
    }
    actionTitle() {
        return "Step\nInto";
    }
}
exports.StepIntoAction = StepIntoAction;

},{"./default-action":3}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepOutAction = void 0;
const default_action_1 = require("./default-action");
class StepOutAction extends default_action_1.DefaultAction {
    actionId() {
        return "StepOut";
    }
    actionTitle() {
        return "Step\nOut";
    }
}
exports.StepOutAction = StepOutAction;

},{"./default-action":3}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepOverAction = void 0;
const default_action_1 = require("./default-action");
class StepOverAction extends default_action_1.DefaultAction {
    actionId() {
        return "StepOver";
    }
    actionTitle() {
        return "Step\nOver";
    }
}
exports.StepOverAction = StepOverAction;

},{"./default-action":3}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopWithDropDownAction = void 0;
const default_action_1 = require("./default-action");
class StopWithDropDownAction extends default_action_1.DefaultAction {
    actionId() {
        return "Stop";
    }
    actionTitle() {
        return "Stop";
    }
}
exports.StopWithDropDownAction = StopWithDropDownAction;

},{"./default-action":3}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdeaPlugin = void 0;
const streamdeck_typescript_1 = require("streamdeck-typescript");
const git_pull_action_1 = require("./actions/git-pull-action");
const newProject_1 = require("./actions/newProject");
const run_action_1 = require("./actions/run-action");
const step_over_action_1 = require("./actions/step-over-action");
const debug_action_1 = require("./actions/debug-action");
const resume_action_1 = require("./actions/resume-action");
const search_everywhere_action_1 = require("./actions/search-everywhere-action");
const stop_action_1 = require("./actions/stop-action");
const pause_action_1 = require("./actions/pause-action");
const step_out_action_1 = require("./actions/step-out-action");
const project_structure_action_1 = require("./actions/project-structure-action");
const empty_action_1 = require("./actions/empty-action");
const action_id_browser_action_1 = require("./actions/action-id-browser-action");
const step_into_action_1 = require("./actions/step-into-action");
class IdeaPlugin extends streamdeck_typescript_1.StreamDeckPluginHandler {
    constructor() {
        super();
        new git_pull_action_1.GitPullAction(this, 'com.jetbrains.idea.git.pull');
        new newProject_1.NewProjectAction(this, 'com.jetbrains.idea.new');
        new run_action_1.RunAction(this, 'com.jetbrains.idea.run');
        new debug_action_1.DebugAction(this, "com.jetbrains.idea.debug");
        new step_over_action_1.StepOverAction(this, 'com.jetbrains.idea.step.over');
        new step_into_action_1.StepIntoAction(this, 'com.jetbrains.idea.step.into');
        new step_out_action_1.StepOutAction(this, 'com.jetbrains.idea.action.step.out');
        new resume_action_1.ResumeAction(this, 'com.jetbrains.idea.resume');
        new pause_action_1.PauseAction(this, 'com.jetbrains.idea.action.pause');
        new stop_action_1.StopWithDropDownAction(this, 'com.jetbrains.idea.action.stop');
        new search_everywhere_action_1.SearchEverywhereAction(this, 'com.jetbrains.idea.search.everywhere');
        new project_structure_action_1.ShowProjectStructureAction(this, 'com.jetbrains.idea.action.show.project.structure');
        new empty_action_1.EmptyAction(this, 'com.jetbrains.idea.empty.action');
        new action_id_browser_action_1.ActionIdBrowserAction(this, 'com.jetbrains.idea.action.browser');
    }
}
exports.IdeaPlugin = IdeaPlugin;
new IdeaPlugin();

},{"./actions/action-id-browser-action":1,"./actions/debug-action":2,"./actions/empty-action":4,"./actions/git-pull-action":5,"./actions/newProject":6,"./actions/pause-action":7,"./actions/project-structure-action":8,"./actions/resume-action":9,"./actions/run-action":10,"./actions/search-everywhere-action":11,"./actions/step-into-action":12,"./actions/step-out-action":13,"./actions/step-over-action":14,"./actions/stop-action":15,"streamdeck-typescript":28}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"./stream-deck-action":19,"./stream-deck-handler-base":20,"./stream-deck-plugin-handler":21,"./stream-deck-property-inspector-handler":22}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
        if (this._ws)
            this._ws.send(JSON.stringify(eventToSend));
        else {
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
                this._ws.send(cachedEvent);
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

},{"../manager/event.manager":32,"../manager/settings.manager":33}],21:[function(require,module,exports){
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

},{"../classes/stream-deck-action.class":23,"../interfaces/enums":29,"../manager/action.manager":31,"./stream-deck-handler-base":20}],22:[function(require,module,exports){
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

},{"../decorators/on-pi-event.decorator":26,"./stream-deck-handler-base":20}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDOnPiEvent = exports.SDOnActionEvent = void 0;
const on_action_event_decorator_1 = require("./on-action-event.decorator");
Object.defineProperty(exports, "SDOnActionEvent", { enumerable: true, get: function () { return on_action_event_decorator_1.SDOnActionEvent; } });
const on_pi_event_decorator_1 = require("./on-pi-event.decorator");
Object.defineProperty(exports, "SDOnPiEvent", { enumerable: true, get: function () { return on_pi_event_decorator_1.SDOnPiEvent; } });

},{"./on-action-event.decorator":25,"./on-pi-event.decorator":26}],25:[function(require,module,exports){
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

},{"../manager/event.manager":32}],26:[function(require,module,exports){
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

},{"../manager/event.manager":32}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"./abstracts/abstracts":18,"./classes/stream-deck-action.class":23,"./decorators/decorators":24,"./interfaces/interfaces":30,"./manager/action.manager":31,"./manager/event.manager":32,"./manager/settings.manager":33}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.StateType = exports.TargetType = exports.DeviceType = void 0;
const enums_1 = require("./enums");
Object.defineProperty(exports, "DeviceType", { enumerable: true, get: function () { return enums_1.DeviceType; } });
Object.defineProperty(exports, "EventType", { enumerable: true, get: function () { return enums_1.EventType; } });
Object.defineProperty(exports, "StateType", { enumerable: true, get: function () { return enums_1.StateType; } });
Object.defineProperty(exports, "TargetType", { enumerable: true, get: function () { return enums_1.TargetType; } });

},{"./enums":29}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"../errors/illegal-argument.error":27}],33:[function(require,module,exports){
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

},{}]},{},[16]);
