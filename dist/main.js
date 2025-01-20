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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_extra_1 = __importDefault(require("fs-extra"));
commander_1.program.requiredOption('-t, --template <name>', 'Название шаблона (можно посмотреть в папках html или template)');
commander_1.program.requiredOption('-e, --excel <path>', 'Файл с описанием фотографий');
commander_1.program.requiredOption('-p, --photos <path>', 'Папка с фотографиями');
commander_1.program.requiredOption('-r, --result <path>', 'Папка, в которую будет помещён результат');
commander_1.program.parse();
const options = commander_1.program.opts();
(async () => {
    var _a;
    fs_extra_1.default.ensureDirSync(options.result);
    const selectedTemplate = (await (_a = `./template/${options.template}`, Promise.resolve().then(() => __importStar(require(_a))))).default;
    const template = new selectedTemplate(options.excel, options.photos, options.result);
    await template.process();
})();
