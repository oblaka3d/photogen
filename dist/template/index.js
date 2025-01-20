"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const puppeteer_cluster_1 = require("puppeteer-cluster");
const exceljs_1 = __importDefault(require("exceljs"));
class Template {
    // Объекты, которые нужны в работе шаблона
    workbook; // Объявляется в processExcel
    cluster; // Объявляется в processPhotos
    // Создаёт картинку
    queueProduct(htmlProps, filename) {
        const picturePath = this.autoNumbering ? `${this.resultPath}/${filename} - ${this.fileNumber++}.jpg` : `${this.resultPath}/${filename}.jpg`;
        this.cluster.queue(null, async ({ page }) => {
            await page.goto(`file://${path_1.default.join(__dirname, this.name, 'html', 'index.html')}?${this.getUrlParams(htmlProps)}`);
            await page.screenshot({ 'fullPage': true, 'path': picturePath, 'quality': 100 });
            await page.close();
        });
    }
    // Функция, которая принимает на вход GET-параметры веб-страницы в виде объекта, передавать в queueProduct
    getUrlParams(htmlProps) {
        return new URLSearchParams(htmlProps).toString();
    }
    // Счётчик для нумерации в названиях файлов
    fileNumber = 1;
    // Пути к эксельке и папкам с фотками
    excelPath;
    photosPath;
    resultPath;
    constructor(excelPath, photosPath, resultPath) {
        this.excelPath = excelPath;
        this.photosPath = photosPath;
        this.resultPath = resultPath;
        this.workbook = new exceljs_1.default.Workbook();
    }
    // Главный метод, который будет вызывать клиент
    async process() {
        await this.processExcel();
        await this.processPhotos();
    }
    // Запуск процесса получения информации из экселя
    async processExcel() {
        await this.workbook.xlsx.readFile(this.excelPath);
        this.products = await this.parseExcel();
    }
    // Запуск процесса генерации картинок
    async processPhotos() {
        this.cluster = await puppeteer_cluster_1.Cluster.launch({
            concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 5,
            puppeteerOptions: {
                defaultViewport: { width: this.width, height: this.height },
                headless: false,
            }
        });
        this.movePhotos();
        this.products.forEach(product => {
            if (this.autoNumbering)
                this.fileNumber = 1;
            this.processProduct(product);
        });
        await this.cluster.idle();
        await this.cluster.close();
        this.clearPhotos();
    }
    // Перемещаем фото из photosPath в html/${this.name}/temp
    movePhotos() {
        this.clearPhotos();
        fs_extra_1.default.copySync(this.photosPath, path_1.default.join(__dirname, this.name, 'html', 'temp'));
    }
    // Очищаем html/${this.name}/temp
    clearPhotos() {
        fs_extra_1.default.removeSync(path_1.default.join(__dirname, this.name, 'html', 'temp'));
    }
}
exports.default = Template;
