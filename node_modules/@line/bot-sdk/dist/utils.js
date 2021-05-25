"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMultipartFormData = exports.ensureJSON = exports.toArray = void 0;
const exceptions_1 = require("./exceptions");
const FormData = require("form-data");
function toArray(maybeArr) {
    return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}
exports.toArray = toArray;
function ensureJSON(raw) {
    if (typeof raw === "object") {
        return raw;
    }
    else {
        throw new exceptions_1.JSONParseError("Failed to parse response body as JSON", raw);
    }
}
exports.ensureJSON = ensureJSON;
function createMultipartFormData(formBody) {
    const formData = this instanceof FormData ? this : new FormData();
    Object.entries(formBody).forEach(([key, value]) => {
        if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
            formData.append(key, value);
        }
        else {
            formData.append(key, String(value));
        }
    });
    return formData;
}
exports.createMultipartFormData = createMultipartFormData;
