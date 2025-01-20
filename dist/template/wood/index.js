"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
class WoodTemplate extends __1.default {
    name = 'wood';
    width = 1800;
    height = 2400;
    products = [];
    autoNumbering = true;
    async parseExcel() {
        const sheet = this.workbook.getWorksheet(1);
        const result = [];
        // @ts-ignore
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1)
                return;
            const values = row.values;
            result.push({
                name: values[1],
                collection: values[2],
                quantity: values[3],
                box: values[4],
                photos: {
                    onBox: values[5],
                    insideBox: values[6],
                    front: values[7],
                    back: values[8],
                    frontWithRuler: values[9],
                    backWithRuler: values[10],
                    box: values[11],
                    boxWithShavings: values[12],
                    onTree: values[13]
                }
            });
        });
        return result;
    }
    async processProduct(product) {
        const boxInFilename = {
            'Фанерная': 'в фанерной коробке',
            'Картонная': 'в картонной коробке',
            'Фанерный домик': 'в фанерном домике'
        };
        const filename = `${product.name} ${boxInFilename[product.box]}`;
        if (product.box !== 'Картонная') {
            // Все на коробке
            this.queueProduct({
                name: product.name,
                collection: product.collection,
                quantity: product.quantity,
                box: product.box,
                photo: product.photos.onBox,
                icon: 'gift',
                text: 'Идеально для подарка'
            }, filename);
            // Все в коробке
            this.queueProduct({
                name: product.name,
                collection: product.collection,
                quantity: product.quantity,
                box: product.box,
                photo: product.photos.insideBox,
                icon: 'gift',
                text: 'Идеально для подарка'
            }, filename);
        }
        // Спереди без линейки
        this.queueProduct({
            name: product.name,
            collection: product.collection,
            quantity: product.quantity,
            box: product.box,
            photo: product.photos.front,
            icon: 'paintbrush',
            text: 'Ручная роспись'
        }, filename);
        // Сзади без линейки
        this.queueProduct({
            name: product.name,
            collection: product.collection,
            quantity: product.quantity,
            box: product.box,
            photo: product.photos.back,
            icon: 'tree',
            text: '100% натуральное дерево'
        }, filename);
        // Спереди с линейкой
        this.queueProduct({
            name: product.name,
            collection: product.collection,
            quantity: product.quantity,
            box: product.box,
            photo: product.photos.frontWithRuler,
            icon: 'shield',
            text: 'Небьющиеся'
        }, filename);
        // Сзади с линейкой
        this.queueProduct({
            name: product.name,
            collection: product.collection,
            quantity: product.quantity,
            box: product.box,
            photo: product.photos.backWithRuler,
            icon: 'check',
            text: 'Безопасно для детей<br>и животных'
        }, filename);
        // Коробка
        this.queueProduct({
            name: product.name,
            collection: product.collection,
            quantity: product.quantity,
            box: product.box,
            photo: product.photos.box,
            text: product.box === 'Фанерная' ?
                'Удобная фанерная<br>подарочная коробка'
                : product.box === 'Картонная' ?
                    'Удобная картонная коробка'
                    : 'Красивый фанерный домик'
        }, filename);
        // Коробка со стружкой
        this.queueProduct({
            name: product.name,
            collection: product.collection,
            quantity: product.quantity,
            box: product.box,
            photo: product.photos.boxWithShavings,
            text: 'Наполнитель: бумажная стружка'
        }, filename);
        // На елке
        this.queueProduct({
            name: product.name,
            collection: product.collection,
            quantity: product.quantity,
            box: product.box,
            photo: product.photos.onTree,
            text: 'Яркие, разноцветные,<br>лакированные'
        }, filename);
    }
}
exports.default = WoodTemplate;
