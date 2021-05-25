"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const stream_1 = require("stream");
const exceptions_1 = require("./exceptions");
const fileType = require("file-type");
const qs = require("querystring");
const pkg = require("../package.json");
class HTTPClient {
    constructor(config = {}) {
        this.config = config;
        const { baseURL, defaultHeaders } = config;
        this.instance = axios_1.default.create({
            baseURL,
            headers: Object.assign({}, defaultHeaders, {
                "User-Agent": `${pkg.name}/${pkg.version}`,
            }),
        });
        this.instance.interceptors.response.use(res => res, err => Promise.reject(this.wrapError(err)));
    }
    async get(url, params) {
        const res = await this.instance.get(url, { params });
        return res.data;
    }
    async getStream(url, params) {
        const res = await this.instance.get(url, {
            params,
            responseType: "stream",
        });
        return res.data;
    }
    async post(url, body, config) {
        const res = await this.instance.post(url, body, Object.assign({ headers: Object.assign({ "Content-Type": "application/json" }, (config && config.headers)) }, config));
        return this.responseParse(res);
    }
    responseParse(res) {
        const { responseParser } = this.config;
        if (responseParser)
            return responseParser(res);
        else
            return res.data;
    }
    async put(url, body, config) {
        const res = await this.instance.put(url, body, Object.assign({ headers: Object.assign({ "Content-Type": "application/json" }, (config && config.headers)) }, config));
        return this.responseParse(res);
    }
    async postForm(url, body) {
        const res = await this.instance.post(url, qs.stringify(body), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return res.data;
    }
    async toBuffer(data) {
        if (Buffer.isBuffer(data)) {
            return data;
        }
        else if (data instanceof stream_1.Readable) {
            return await new Promise((resolve, reject) => {
                const buffers = [];
                let size = 0;
                data.on("data", (chunk) => {
                    buffers.push(chunk);
                    size += chunk.length;
                });
                data.on("end", () => resolve(Buffer.concat(buffers, size)));
                data.on("error", reject);
            });
        }
        else {
            throw new Error("invalid data type for binary data");
        }
    }
    async postBinary(url, data, contentType) {
        const buffer = await this.toBuffer(data);
        const res = await this.instance.post(url, buffer, {
            headers: {
                "Content-Type": contentType || (await fileType.fromBuffer(buffer)).mime,
                "Content-Length": buffer.length,
            },
        });
        return res.data;
    }
    async delete(url, params) {
        const res = await this.instance.delete(url, { params });
        return res.data;
    }
    wrapError(err) {
        if (err.response) {
            return new exceptions_1.HTTPError(err.message, err.response.status, err.response.statusText, err);
        }
        else if (err.code) {
            return new exceptions_1.RequestError(err.message, err.code, err);
        }
        else if (err.config) {
            // unknown, but from axios
            return new exceptions_1.ReadError(err);
        }
        // otherwise, just rethrow
        return err;
    }
}
exports.default = HTTPClient;
