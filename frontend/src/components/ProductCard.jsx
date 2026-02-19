import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-card__header">
        <span className="product-card__category">{product.category}</span>
        <span className="product-card__stock">В наличии: {product.stock} шт.</span>
      </div>
      
      <h3 className="product-card__name">{product.name}</h3>
      
      <p className="product-card__description">{product.description}</p>
      
      <div className="product-card__details">
        <span className="product-card__price">{product.price.toLocaleString()} ₽</span>
      </div>
      
      <div className="product-card__actions">
        <button 
          className="btn btn-small" 
          onClick={() => onEdit(product)}
        >
          ✏️ Редактировать
        </button>
        <button 
          className="btn btn-small btn--danger" 
          onClick={() => onDelete(product.id)}
        >
          🗑️ Удалить
        </button>
      </div>
    </div>
  );
}