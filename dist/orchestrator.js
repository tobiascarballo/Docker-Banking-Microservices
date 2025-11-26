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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOrchestrator = void 0;
// servicio mas importante (escucha al command, procesa la saga y publica el progreso en events)
var kafka_1 = require("./kafka");
var crypto_1 = require("crypto");
var consumer = null;
var producer = null;
// simula un delay
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
// publica un evento
var publishEvent = function (topic, transactionId, userId, type, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var event;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!producer) {
                    console.error('[Orchestrator] El productor no está inicializado. No se puede publicar el evento.');
                    throw new Error('El productor no está inicializado');
                }
                event = {
                    id: (0, crypto_1.randomUUID)(),
                    type: type,
                    version: 1,
                    ts: Date.now(),
                    transactionId: transactionId,
                    userId: userId,
                    payload: payload,
                };
                return [4 /*yield*/, producer.send({
                        topic: topic,
                        messages: [
                            {
                                key: transactionId,
                                value: JSON.stringify(event),
                            },
                        ],
                    })];
            case 1:
                _a.sent();
                console.log("[Orchestrator] Evento ".concat(type, " publicado para ").concat(transactionId));
                return [2 /*return*/];
        }
    });
}); };
// inicia el Orquestador
var startOrchestrator = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (consumer) {
                    console.log('Orchestrator consumer is already running.');
                    return [2 /*return*/];
                }
                consumer = kafka_1.kafka.consumer({ groupId: 'orchestrator-group' });
                producer = kafka_1.kafka.producer();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 11]);
                console.log('[Orchestrator] Connecting consumer...');
                return [4 /*yield*/, consumer.connect()];
            case 2:
                _a.sent();
                console.log('[Orchestrator] Consumer connected.');
                console.log('[Orchestrator] Connecting producer...');
                return [4 /*yield*/, producer.connect()];
            case 3:
                _a.sent();
                console.log('[Orchestrator] Producer connected.');
                return [4 /*yield*/, consumer.subscribe({ topic: kafka_1.KAFKA_TOPIC_COMMANDS, fromBeginning: true })];
            case 4:
                _a.sent();
                console.log("[Orchestrator] Subscribed to topic: ".concat(kafka_1.KAFKA_TOPIC_COMMANDS));
                return [4 /*yield*/, consumer.run({
                        eachMessage: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var command, transactionId, userId, payload, risk, err_1;
                            var topic = _b.topic, partition = _b.partition, message = _b.message;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!message.value)
                                            return [2 /*return*/];
                                        command = JSON.parse(message.value.toString());
                                        transactionId = command.transactionId, userId = command.userId, payload = command.payload;
                                        console.log("[Orchestrator] Procesando ".concat(command.type, " para ").concat(transactionId));
                                        _c.label = 1;
                                    case 1:
                                        _c.trys.push([1, 15, , 17]);
                                        return [4 /*yield*/, sleep(1000)];
                                    case 2:
                                        _c.sent();
                                        return [4 /*yield*/, publishEvent(kafka_1.KAFKA_TOPIC_EVENTS, transactionId, userId, 'txn.FundsReserved', { ok: true, holdId: (0, crypto_1.randomUUID)(), amount: payload.amount })];
                                    case 3:
                                        _c.sent();
                                        // 2. Chequeo de Fraude (Simulado)
                                        return [4 /*yield*/, sleep(1500)];
                                    case 4:
                                        // 2. Chequeo de Fraude (Simulado)
                                        _c.sent();
                                        risk = Math.random() < 0.1 ? 'HIGH' : 'LOW';
                                        if (!(risk === 'HIGH')) return [3 /*break*/, 8];
                                        // 3.a. Riesgo ALTO: Revertir
                                        return [4 /*yield*/, publishEvent(kafka_1.KAFKA_TOPIC_EVENTS, transactionId, userId, 'txn.FraudChecked', { risk: 'HIGH' })];
                                    case 5:
                                        // 3.a. Riesgo ALTO: Revertir
                                        _c.sent();
                                        return [4 /*yield*/, sleep(500)];
                                    case 6:
                                        _c.sent();
                                        return [4 /*yield*/, publishEvent(kafka_1.KAFKA_TOPIC_EVENTS, transactionId, userId, 'txn.Reversed', { reason: 'High fraud risk' })];
                                    case 7:
                                        _c.sent();
                                        console.log("[Orchestrator] Transacci\u00F3n ".concat(transactionId, " REVERTIDA"));
                                        return [3 /*break*/, 14];
                                    case 8: 
                                    // 3.b. Riesgo BAJO: Confirmar
                                    return [4 /*yield*/, publishEvent(kafka_1.KAFKA_TOPIC_EVENTS, transactionId, userId, 'txn.FraudChecked', { risk: 'LOW' })];
                                    case 9:
                                        // 3.b. Riesgo BAJO: Confirmar
                                        _c.sent();
                                        return [4 /*yield*/, sleep(1000)];
                                    case 10:
                                        _c.sent();
                                        // 4. Confirmar (Committed)
                                        return [4 /*yield*/, publishEvent(kafka_1.KAFKA_TOPIC_EVENTS, transactionId, userId, 'txn.Committed', { ledgerTxId: (0, crypto_1.randomUUID)() })];
                                    case 11:
                                        // 4. Confirmar (Committed)
                                        _c.sent();
                                        return [4 /*yield*/, sleep(500)];
                                    case 12:
                                        _c.sent();
                                        // 5. Notificar
                                        return [4 /*yield*/, publishEvent(kafka_1.KAFKA_TOPIC_EVENTS, transactionId, userId, 'txn.Notified', { channels: ['email', 'push'] })];
                                    case 13:
                                        // 5. Notificar
                                        _c.sent();
                                        console.log("[Orchestrator] Transacci\u00F3n ".concat(transactionId, " COMPLETADA"));
                                        _c.label = 14;
                                    case 14: return [3 /*break*/, 17];
                                    case 15:
                                        err_1 = _c.sent();
                                        console.error("[Orchestrator] Error inesperado procesando ".concat(transactionId, ":"), err_1);
                                        return [4 /*yield*/, publishEvent(kafka_1.KAFKA_TOPIC_DLQ, transactionId, userId, 'txn.ProcessingFailed', { error: err_1.message, originalCommand: command })];
                                    case 16:
                                        _c.sent();
                                        return [3 /*break*/, 17];
                                    case 17: return [2 /*return*/];
                                }
                            });
                        }); },
                    })];
            case 5:
                _a.sent();
                return [3 /*break*/, 11];
            case 6:
                error_1 = _a.sent();
                console.error('[Orchestrator] Error fatal al iniciar:', error_1);
                if (!consumer) return [3 /*break*/, 8];
                return [4 /*yield*/, consumer.disconnect().catch(console.error)];
            case 7:
                _a.sent();
                consumer = null;
                _a.label = 8;
            case 8:
                if (!producer) return [3 /*break*/, 10];
                return [4 /*yield*/, producer.disconnect().catch(console.error)];
            case 9:
                _a.sent();
                producer = null;
                _a.label = 10;
            case 10: return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.startOrchestrator = startOrchestrator;
