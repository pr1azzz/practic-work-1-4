const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const port = 4000;

// Начальные данные
let products = [
  { id: nanoid(6), name: 'Ноутбук ASUS ROG', category: 'Ноутбуки', description: 'Игровой ноутбук с RTX 4060, 16GB RAM, 1TB SSD', price: 129990, stock: 5 },
  { id: nanoid(6), name: 'Смартфон iPhone 15 Pro', category: 'Смартфоны', description: '6.1" OLED, A17 Pro, 256GB, тройная камера', price: 119990, stock: 8 },
  { id: nanoid(6), name: 'Смартфон Samsung S23 Ultra', category: 'Смартфоны', description: '6.8" AMOLED, 200MP камера, S-Pen', price: 99990, stock: 3 },
  { id: nanoid(6), name: 'Планшет iPad Pro', category: 'Планшеты', description: '12.9" Liquid Retina, M2, 256GB', price: 89990, stock: 4 },
  { id: nanoid(6), name: 'Наушники Sony WH-1000XM5', category: 'Аудио', description: 'Беспроводные наушники с шумоподавлением', price: 29990, stock: 12 },
  { id: nanoid(6), name: 'Клавиатура Logitech MX Keys', category: 'Аксессуары', description: 'Беспроводная клавиатура для продуктивности', price: 11990, stock: 7 },
  { id: nanoid(6), name: 'Мышь Logitech MX Master 3S', category: 'Аксессуары', description: 'Эргономичная беспроводная мышь', price: 8990, stock: 9 },
  { id: nanoid(6), name: 'Монитор Samsung Odyssey', category: 'Мониторы', description: '32" изогнутый, 4K, 144Hz', price: 54990, stock: 2 },
  { id: nanoid(6), name: 'Внешний SSD Samsung T7', category: 'Хранение', description: '1TB, USB 3.2, скорость 1050MB/s', price: 9990, stock: 15 },
  { id: nanoid(6), name: 'Умные часы Apple Watch Series 9', category: 'Гаджеты', description: 'GPS, 45mm, всегда включенный дисплей', price: 45990, stock: 6 },
  { id: nanoid(6), name: 'Роутер TP-Link Archer AX73', category: 'Сети', description: 'Wi-Fi 6, скорость до 5400 Мбит/с', price: 12990, stock: 4 }
];

// middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// middleware для логирования запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// функция-помощник для поиска товара
function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

// GET /api/products - все товары
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id - товар по ID
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

// POST /api/products - создать товар
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock } = req.body;
  
  if (!name || !category || !description || !price || stock === undefined) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }
  
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock)
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PATCH /api/products/:id - обновить товар
app.patch('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  
  const { name, category, description, price, stock } = req.body;
  
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  
  res.json(product);
});

// DELETE /api/products/:id - удалить товар
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const exists = products.some(p => p.id === id);
  if (!exists) return res.status(404).json({ error: "Product not found" });
  
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// запуск сервера
app.listen(port, () => {
  console.log(`🛒 Магазин API запущен на http://localhost:${port}/api/products`);
});