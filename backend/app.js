const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

// ===== SWAGGER =====
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 4000; // Бэкенд на 3000

// ===== CORS для фронтенда =====
app.use(cors({
  origin: 'http://localhost:4001', // Твой фронтенд порт
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// ===== ТОВАРЫ (Products) - 11 штук =====
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

// ===== SWAGGER КОНФИГУРАЦИЯ =====
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API управления товарами',
      version: '1.0.0',
      description: 'API для интернет-магазина электроники',
      contact: {
        name: 'Разработчик',
        email: 'developer@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер разработки'
      }
    ],
    tags: [
      {
        name: 'Products',
        description: 'Управление товарами'
      }
    ]
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

// ===== SWAGGER СХЕМЫ =====
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор товара
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Название товара
 *           example: "Ноутбук ASUS ROG"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Ноутбуки"
 *         description:
 *           type: string
 *           description: Описание товара
 *           example: "Игровой ноутбук с RTX 4060, 16GB RAM"
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *           example: 129990
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *           example: 5
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 *           example: "Product not found"
 */

// ===== CRUD ЭНДПОИНТЫ =====

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     description: Получает массив всех товаров из базы данных
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар
 *     description: Добавляет новый товар в базу данных
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новый товар"
 *               category:
 *                 type: string
 *                 example: "Категория"
 *               description:
 *                 type: string
 *                 example: "Описание товара"
 *               price:
 *                 type: number
 *                 example: 9990
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Неверные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock } = req.body;
  
  if (!name || !category || !description || !price || stock === undefined) {
    return res.status(400).json({ error: "All fields are required" });
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

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     description: Возвращает один товар по его уникальному ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные товара
 *     description: Частично обновляет информацию о товаре
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Товар не найден
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     description: Удаляет товар по его ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  
  const exists = products.some(p => p.id === id);
  if (!exists) return res.status(404).json({ error: "Product not found" });
  
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🛒 API магазина запущен на http://localhost:${port}/api/products`);
  console.log(`📚 Swagger документация: http://localhost:${port}/api-docs`);
});