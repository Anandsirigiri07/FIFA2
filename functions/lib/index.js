"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const genai_1 = require("@google/genai");
const express_rate_limit_1 = require("express-rate-limit");
const app = (0, express_1.default)();
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }
        const isAllowed = allowedOrigins.includes(origin) ||
            /^https:\/\/[a-zA-Z0-9-.]+\.web\.app$/.test(origin) ||
            /^https:\/\/[a-zA-Z0-9-.]+\.firebaseapp\.com$/.test(origin);
        if (isAllowed) {
            callback(null, true);
        }
        else {
            const error = new Error('Not allowed by CORS');
            error.status = 403;
            error.statusCode = 403;
            callback(error);
        }
    }
}));
app.use(express_1.default.json());
const apiKey = (process.env.GEMINI_API_KEY ||
    ((_a = functions.config().gemini) === null || _a === void 0 ? void 0 : _a.key) ||
    '').replace(/['"]/g, '').trim();
const genAI = apiKey ? new genai_1.GoogleGenAI({ apiKey }) : null;
const chatRateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 30 requests per windowMs
    statusCode: 429,
    message: { error: 'Rate limit exceeded. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Health check endpoint.
 */
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
/**
 * Main chat endpoint — proxies to Gemini securely.
 */
app.post('/api/chat', chatRateLimiter, async (req, res) => {
    const { message, persona, language } = req.body;
    if (typeof message !== 'string') {
        res.status(400).json({ error: 'Message string is required' });
        return;
    }
    const validPersona = typeof persona === 'string' && persona.trim() ? persona.trim() : 'fan';
    const validLanguage = typeof language === 'string' && language.trim() ? language.trim() : 'en';
    if (!genAI) {
        console.warn('GEMINI_API_KEY is not configured. Falling back to local mock response.');
        res.json({
            role: 'assistant',
            content: `[Mock AI - ${validLanguage} - ${validPersona}]: This is a simulated response to your question: "${message}". Configure GEMINI_API_KEY in your environment for live connectivity.`
        });
        return;
    }
    try {
        const promptContext = `You are StadiumIQ AI, a smart helper for FIFA World Cup 2026. Respond in ${validLanguage} under the persona of ${validPersona}. Message: ${message}`;
        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: promptContext
        });
        res.json({
            role: 'assistant',
            content: response.text || ''
        });
    }
    catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to communicate with Gemini API' });
    }
});
exports.api = functions
    .runWith({ timeoutSeconds: 30, memory: '256MB' })
    .https.onRequest(app);
//# sourceMappingURL=index.js.map