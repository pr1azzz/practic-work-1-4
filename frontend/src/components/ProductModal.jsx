import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (!open) return;
    
    if (initialProduct) {
      setName(initialProduct.name || "");
      setCategory(initialProduct.category || "");
      setDescription(initialProduct.description || "");
      setPrice(initialProduct.price?.toString() || "");
      setStock(initialProduct.stock?.toString() || "");
    } else {
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setStock("");
    }
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Добавление товара";

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const numPrice = Number(price);
    const numStock = Number(stock);
    
    if (!trimmedName) {
      alert("Введите название товара");
      return;
    }
    if (!trimmedCategory) {
      alert("Введите категорию");
      return;
    }
    if (!trimmedDescription) {
      alert("Введите описание");
      return;
    }
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      alert("Введите корректную цену (больше 0)");
      return;
    }
    if (!Number.isInteger(numStock) || numStock < 0) {
      alert("Введите корректное количество (целое число ≥ 0)");
      return;
    }
    
    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category: trimmedCategory,
      description: trimmedDescription,
      price: numPrice,
      stock: numStock
    });
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose}>✕</button>
        </div>
        
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название товара
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Ноутбук ASUS"
              autoFocus
            />
          </label>
          
          <label className="label">
            Категория
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Например, Ноутбуки"
            />
          </label>
          
          <label className="label">
            Описание
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробное описание товара"
            />
          </label>
          
          <div className="row">
            <label className="label">
              Цена (₽)
              <input
                className="input"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="129990"
                min="1"
                step="1"
              />
            </label>
            
            <label className="label">
              Количество на складе
              <input
                className="input"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="5"
                min="0"
                step="1"
              />
            </label>
          </div>
          
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}