/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/backend/SimCell.ts":
/*!********************************!*\
  !*** ./src/backend/SimCell.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.SimCell = void 0;\r\nclass SimCell {\r\n    constructor(state, index) {\r\n        this.currentState = state;\r\n        this.nextState = -1;\r\n        this.neighbours = [];\r\n        this.index = index;\r\n    }\r\n    get alive() {\r\n        return this.currentState > 0;\r\n    }\r\n    addNeighbour(cell) {\r\n        this.neighbours.push(cell);\r\n    }\r\n    calculateStep(settings) {\r\n        let neighbourCount = this.neighbours.filter((n) => n.alive).length;\r\n        let validNeighbours = this.alive\r\n            ? settings.death\r\n            : settings.birth;\r\n        let willLive = validNeighbours.find((v) => v === neighbourCount) !== undefined;\r\n        let counts = {};\r\n        let max = 0;\r\n        let candidates = [];\r\n        if (willLive) {\r\n            this.neighbours.forEach((n) => {\r\n                if (n.currentState > 0) {\r\n                    counts[n.currentState] = (counts[n.currentState] ?? 0) + 1;\r\n                }\r\n            });\r\n            max = Math.max(...Object.values(counts));\r\n            if (counts[this.currentState] === max) {\r\n                this.nextState = this.currentState;\r\n            }\r\n            else {\r\n                candidates = Object.entries(counts)\r\n                    .filter((countPair) => countPair[1] === max)\r\n                    .map((c) => parseInt(c[0]));\r\n                this.nextState =\r\n                    candidates[Math.floor(Math.random() * candidates.length)];\r\n            }\r\n        }\r\n        else {\r\n            this.nextState = 0;\r\n        }\r\n        return this.nextState;\r\n    }\r\n    step() {\r\n        this.currentState = this.nextState;\r\n    }\r\n}\r\nexports.SimCell = SimCell;\r\n\n\n//# sourceURL=webpack://phaser3template/./src/backend/SimCell.ts?");

/***/ }),

/***/ "./src/backend/clientConnection.ts":
/*!*****************************************!*\
  !*** ./src/backend/clientConnection.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.clientConnection = void 0;\r\nconst AutomataCommands_1 = __webpack_require__(/*! ./commands/AutomataCommands */ \"./src/backend/commands/AutomataCommands.ts\");\r\nconst gameComm_1 = __webpack_require__(/*! ./gameComm */ \"./src/backend/gameComm.ts\");\r\nfunction clientConnection(io, client) {\r\n    client.on(\"message\", (channel, tags, message, self) => parseEmoteCommand(channel, tags, message, self, io));\r\n    io.on(\"connection\", function (socket) {\r\n        gameComm_1.GameCommunication(io, socket);\r\n        //remove the users data when they disconnect.\r\n        socket.on(\"disconnect\", function () { });\r\n    });\r\n    setInterval(() => {\r\n        var time = new Date();\r\n        // console.log(currentUsers.length+\" logged in @ \"+ time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))\r\n    }, 5000);\r\n}\r\nexports.clientConnection = clientConnection;\r\nfunction parseEmoteCommand(channel, tags, message, self, io) {\r\n    if (tags.emotes == undefined) {\r\n        return;\r\n    }\r\n    const stringReplacements = [];\r\n    const emotes = tags.emotes;\r\n    // iterate of emotes to access ids and positions\r\n    Object.entries(emotes).forEach(([id, positions]) => {\r\n        // use only the first position to find out the emote key word\r\n        const position = positions[0];\r\n        const [start, end] = position.split(\"-\");\r\n        const emote = message.substring(parseInt(start, 10), parseInt(end, 10) + 1);\r\n        stringReplacements.push({\r\n            path: `https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`,\r\n            emote: emote,\r\n        });\r\n        let commandData = {\r\n            templateName: \"against the grain\",\r\n            team: tags.username,\r\n        };\r\n        // console.log(stringReplacements.map((r) => r.path));\r\n        io.emit(AutomataCommands_1.AutomataSocketCommand.SPAWN_TEMPLATE, commandData);\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack://phaser3template/./src/backend/clientConnection.ts?");

/***/ }),

/***/ "./src/backend/commands/AutomataCommands.ts":
/*!**************************************************!*\
  !*** ./src/backend/commands/AutomataCommands.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.SimType = exports.AutomataSocketCommand = void 0;\r\nclass AutomataSocketCommand {\r\n}\r\nexports.AutomataSocketCommand = AutomataSocketCommand;\r\nAutomataSocketCommand.SPAWN_TEMPLATE = \"automataSocketCommandSpawnTemplate\";\r\nAutomataSocketCommand.INIT_SIM = \"automataSocketCommandInitializeSimulation\";\r\nAutomataSocketCommand.UPDATE_CELLS = \"automataSocketCommandUpdateCells\";\r\nvar SimType;\r\n(function (SimType) {\r\n    SimType[\"MAIN\"] = \"simTypeMain\";\r\n})(SimType = exports.SimType || (exports.SimType = {}));\r\n\n\n//# sourceURL=webpack://phaser3template/./src/backend/commands/AutomataCommands.ts?");

/***/ }),

/***/ "./src/backend/gameComm.ts":
/*!*********************************!*\
  !*** ./src/backend/gameComm.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.GameCommunication = void 0;\r\nconst SimCell_1 = __webpack_require__(/*! ./SimCell */ \"./src/backend/SimCell.ts\");\r\nconst AutomataCommands_1 = __webpack_require__(/*! ./commands/AutomataCommands */ \"./src/backend/commands/AutomataCommands.ts\");\r\nfunction GameCommunication(io, socket) {\r\n    socket.on(AutomataCommands_1.AutomataSocketCommand.INIT_SIM, (data) => {\r\n        let cells = data.states.map((s, i) => new SimCell_1.SimCell(s, i));\r\n        let row = 0;\r\n        let col = 0;\r\n        let adjRow = 0;\r\n        let adjCol = 0;\r\n        let wrapRow = 0;\r\n        let wrapCol = 0;\r\n        for (row = 0; row < data.height; row++) {\r\n            for (col = 0; col < data.width; col++) {\r\n                for (adjRow = row - 1; adjRow <= row + 1; adjRow++) {\r\n                    for (adjCol = col - 1; adjCol <= col + 1; adjCol++) {\r\n                        if (adjRow === row && adjCol === col) {\r\n                            continue;\r\n                        }\r\n                        else {\r\n                            wrapRow = (adjRow + data.height) % data.height;\r\n                            wrapCol = (adjCol + data.width) % data.width;\r\n                            if (!data.settings.wrap &&\r\n                                (wrapRow !== adjRow || wrapCol !== adjCol)) {\r\n                                continue;\r\n                            }\r\n                            cells[row * data.width + col].addNeighbour(cells[wrapRow * data.width + wrapCol]);\r\n                        }\r\n                    }\r\n                }\r\n            }\r\n        }\r\n        function takeStep() {\r\n            let step = cells.map((c) => c.calculateStep(data.settings));\r\n            socket.emit(AutomataCommands_1.AutomataSocketCommand.UPDATE_CELLS, { states: step });\r\n            cells.forEach((c) => c.step());\r\n        }\r\n        setInterval(takeStep, 64);\r\n    });\r\n    socket.on(\"ready\", () => {\r\n        socket.broadcast.emit(\"add opponent\", 0);\r\n    });\r\n    io.emit(\"update all\", 0);\r\n    setInterval(() => { }, 100 / 30);\r\n}\r\nexports.GameCommunication = GameCommunication;\r\n\n\n//# sourceURL=webpack://phaser3template/./src/backend/gameComm.ts?");

/***/ }),

/***/ "./src/backend/server.ts":
/*!*******************************!*\
  !*** ./src/backend/server.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\r\nconst http_1 = __importDefault(__webpack_require__(/*! http */ \"http\"));\r\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\r\nconst clientConnection_1 = __webpack_require__(/*! ./clientConnection */ \"./src/backend/clientConnection.ts\");\r\n//import mysql from 'mysql'\r\nconst tmi = __webpack_require__(/*! tmi.js */ \"tmi.js\");\r\nconst app = express_1.default();\r\nconst port = process.env.PORT || 3000;\r\nconst server = http_1.default.createServer(app);\r\nconst io = __webpack_require__(/*! socket.io */ \"socket.io\")(server);\r\n// let db =  mysql.createPool({\r\n//     host: '',\r\n//     user: ',\r\n//     password: '',\r\n//     database: ''\r\n//   });\r\n//set up the routes that point web requests to the right files.\r\napp.use(express_1.default.static(\"/../public\"));\r\napp.get(\"/\", (req, res) => {\r\n    res.sendFile(path_1.default.join(__dirname, \"/../public/index.html\"));\r\n});\r\napp.get(\"/mystyle.css\", (req, res) => {\r\n    res.sendFile(path_1.default.join(__dirname, \"/../public/mystyle.css\"));\r\n});\r\napp.get(\"/bundle-front.js\", (req, res) => {\r\n    res.sendFile(path_1.default.join(__dirname, \"/../public/bundle-front.js\"));\r\n});\r\napp.get(\"/assets/*\", (req, res) => {\r\n    res.sendFile(path_1.default.join(__dirname, \"/../public/\" + req.path));\r\n});\r\nconst client = new tmi.Client({\r\n    // options: { debug: true, messagesLogLevel: \"info\" },\r\n    connections: {\r\n        reconnect: true,\r\n        secure: true,\r\n    },\r\n    channels: [\"chaoticyosher\"],\r\n});\r\nclient.connect();\r\n//start the game communication server to handle player data\r\nclientConnection_1.clientConnection(io, client);\r\n//start the web server to distribute the games files.\r\nserver.listen(port, () => {\r\n    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);\r\n});\r\n\n\n//# sourceURL=webpack://phaser3template/./src/backend/server.ts?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");;

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");;

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");;

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");;

/***/ }),

/***/ "tmi.js":
/*!*************************!*\
  !*** external "tmi.js" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("tmi.js");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/backend/server.ts");
/******/ })()
;