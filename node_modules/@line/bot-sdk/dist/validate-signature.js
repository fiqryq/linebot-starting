"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function s2b(str, encoding) {
    return Buffer.from(str, encoding);
}
function safeCompare(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    return crypto_1.timingSafeEqual(a, b);
}
function validateSignature(body, channelSecret, signature) {
    return safeCompare(crypto_1.createHmac("SHA256", channelSecret).update(body).digest(), s2b(signature, "base64"));
}
exports.default = validateSignature;
