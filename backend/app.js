const express = require('express');
const app = express();
const port = 4000;

// middleware для парсинга JSON
app.use(express.json());

// начальный массив товаров
let products = [
    { id: 1, name: 'Ноутбук ASUS', price: 75000 },
    { id: 2, name: 'Мышь Logitech', price: 2500 },
    { id: 3, name: 'Клавиатура Mechanic', price: 4500 }
];
// 1. GET - просмотр всех товаров
app.get('/products', (req, res) => {
    res.json(products);
});

// 2. GET - просмотр товара по id
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.json(product);
});

// 3. POST - добавление нового товара
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    // валидация
    if (!name || !price) {
        return res.status(400).json({ message: 'Необходимо указать название и цену' });
    }
    
    const newProduct = {
        id: Date.now(), // генерация уникального id
        name,
        price: Number(price)
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 4. PATCH - редактирование товара
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
    const { name, price } = req.body;
    
    if (name) product.name = name;
    if (price) product.price = Number(price);
    
    res.json(product);
});

// 5. DELETE - удаление товара
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
    products.splice(productIndex, 1);
    res.json({ message: 'Товар удален' });
});

// корневой маршрут
app.get('/', (req, res) => {
    res.send('API управления товарами. Доступные endpoints: GET /products, POST /products, GET /products/:id, PATCH /products/:id, DELETE /products/:id');
});

// запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});