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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKafkaConsumer = exports.attachWebSocketServer = void 0;
// gateway que escucha el events y lo retransmite por websocket a los clientes
var ws_1 = require("ws");
var kafka_1 = require("./kafka");
var url_1 = require("url");
// crea el servidor de websocket
var createWebSocketServer = function () {
    if (global.wsServer) {
        return global.wsServer;
    }
    console.log('Creating new WebSocket server...');
    var wss = new ws_1.WebSocketServer({ noServer: true });
    wss.on('connection', function (ws) {
        console.log('WebSocket client connected');
        ws.on('message', function (message) {
            console.log('Received message:', message.toString());
        });
        ws.on('close', function () {
            console.log('WebSocket client disconnected');
        });
        ws.on('error', function (error) {
            console.error('WebSocket error:', error);
        });
    });
    console.log('WebSocket server created.');
    global.wsServer = wss;
    return global.wsServer;
};
// esto sirve para enganchar el servidor de websocket al servidor de next
var attachWebSocketServer = function (server) {
    if (!global.wsServer) {
        createWebSocketServer();
    }
    server.on('upgrade', function (request, socket, head) {
        var pathname = (0, url_1.parse)(request.url, true).pathname;
        // Si la ruta es '/ws' la manejamos.
        if (pathname === '/ws') {
            console.log('Ruteando al WebSocket del TP...');
            global.wsServer.handleUpgrade(request, socket, head, function (ws) {
                global.wsServer.emit('connection', ws, request);
            });
        }
        else {
            // Si es cualquier otra ruta se destruye
            console.log('Ignorando conexión WebSocket (probablemente HMR de Next.js)...');
            socket.destroy();
        }
    });
};
exports.attachWebSocketServer = attachWebSocketServer;
var kafkaConsumer = null;
// función para esperar a que se cree el topic de kafka
var waitWithRetry = function (fn_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([fn_1], args_1, true), void 0, function (fn, maxRetries, delay) {
        var i, error_1;
        if (maxRetries === void 0) { maxRetries = 10; }
        if (delay === void 0) { delay = 2000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < maxRetries)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, fn()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4:
                    error_1 = _a.sent();
                    if (i === maxRetries - 1) {
                        throw error_1;
                    }
                    console.log("Intento ".concat(i + 1, "/").concat(maxRetries, " fall\u00F3. Reintentando en ").concat(delay, "ms..."));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
};
// para iniciar el consumidor de kafka
var startKafkaConsumer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (kafkaConsumer) {
                    console.log('Kafka consumer is already running.');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, waitWithRetry(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, kafka_1.ensureTopicsCreated)()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 10, 2000)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Failed to ensure Kafka topics are created after retries:', error_2);
                return [2 /*return*/];
            case 4:
                kafkaConsumer = kafka_1.kafka.consumer({
                    groupId: 'websocket-gateway-group',
                    retry: {
                        initialRetryTime: 300,
                        retries: 8,
                    },
                });
                _a.label = 5;
            case 5:
                _a.trys.push([5, 9, , 12]);
                console.log('Connecting Kafka consumer...');
                return [4 /*yield*/, waitWithRetry(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, kafkaConsumer.connect()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 10, 2000)];
            case 6:
                _a.sent();
                console.log('Kafka consumer connected.');
                return [4 /*yield*/, kafkaConsumer.subscribe({ topic: kafka_1.KAFKA_TOPIC_EVENTS, fromBeginning: true })];
            case 7:
                _a.sent();
                console.log("Subscribed to topic: ".concat(kafka_1.KAFKA_TOPIC_EVENTS));
                return [4 /*yield*/, kafkaConsumer.run({
                        eachMessage: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var event;
                            var topic = _b.topic, partition = _b.partition, message = _b.message;
                            return __generator(this, function (_c) {
                                if (!message.value)
                                    return [2 /*return*/];
                                event = message.value.toString();
                                console.log("[".concat(topic, "] Received event:"), event);
                                if (global.wsServer) {
                                    global.wsServer.clients.forEach(function (client) {
                                        if (client.readyState === ws_1.WebSocket.OPEN) {
                                            client.send(event);
                                        }
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); },
                    })];
            case 8:
                _a.sent();
                return [3 /*break*/, 12];
            case 9:
                error_3 = _a.sent();
                console.error('Error with Kafka consumer after retries:', error_3);
                if (!kafkaConsumer) return [3 /*break*/, 11];
                return [4 /*yield*/, kafkaConsumer.disconnect().catch(console.error)];
            case 10:
                _a.sent();
                kafkaConsumer = null;
                _a.label = 11;
            case 11: return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.startKafkaConsumer = startKafkaConsumer;
// Lógica de inicio para el consumidor de kafka)
if (process.env.NODE_ENV !== 'production' || !global.kafkaConsumerStarted) {
    if (process.env.NODE_ENV !== 'production') {
        (0, exports.startKafkaConsumer)();
    }
    else {
        if (!global.kafkaConsumerStarted) {
            (0, exports.startKafkaConsumer)();
            global.kafkaConsumerStarted = true;
        }
    }
}
