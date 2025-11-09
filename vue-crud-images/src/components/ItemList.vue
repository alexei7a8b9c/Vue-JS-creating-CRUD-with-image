<template>
  <div class="items-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка элементов...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>Ошибка: {{ error }}</p>
      <button @click="$emit('retry')" class="btn btn-primary">Повторить</button>
    </div>
    
    <div v-else>
      <div class="items-header">
        <h2>Список элементов ({{ items.length }})</h2>
      </div>
      
      <div v-if="items.length === 0" class="no-items">
        <p>Нет элементов для отображения</p>
        <p class="no-items-hint">Создайте первый элемент используя форму выше</p>
      </div>
      
      <div v-else class="items-grid">
        <div 
          v-for="item in items" 
          :key="item.id" 
          class="item-card"
          :class="{ 'editing': editingItemId === item.id }"
        >
          <div class="item-image-container">
            <img 
              v-if="item.imageUrl" 
              :src="item.imageUrl" 
              :alt="item.title" 
              class="item-image"
              @load="handleImageLoad(item.id)"
              @error="handleImageError(item.id)"
            />
            <div v-else class="no-image">
              <span>🖼️</span>
              <p>Нет изображения</p>
            </div>
            
            <div class="item-badge" v-if="item.updatedAt">
              Обновлено
            </div>
          </div>
          
          <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-description">{{ item.description }}</p>
            
            <div class="item-meta">
              <small>Создан: {{ formatDate(item.createdAt) }}</small>
              <small v-if="item.updatedAt">Обновлен: {{ formatDate(item.updatedAt) }}</small>
            </div>
          </div>
          
         <div class="item-actions">
    <button 
      @click="$emit('edit', item)" 
      class="btn btn-primary"
      :disabled="loading"
    >
      ✏️ Редактировать
    </button>
    <button 
      @click="$emit('delete', item.id)" 
      class="btn btn-danger delete-btn"
      :disabled="loading"
    >
      🗑️ Удалить
    </button>
  </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  error: String,
  editingItemId: Number
});

defineEmits(['edit', 'delete', 'retry']);

// Обработчики загрузки изображений
const loadedImages = ref(new Set());

const handleImageLoad = (itemId) => {
  loadedImages.value.add(itemId);
  console.log(`Изображение для элемента ${itemId} успешно загружено`);
};

const handleImageError = (itemId) => {
  console.error(`Ошибка загрузки изображения для элемента ${itemId}`);
};

// Форматирование даты
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.items-header {
  margin-bottom: 20px;
  text-align: center;
}

.items-header h2 {
  color: #2c3e50;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 40px;
  background: #ffeaa7;
  border-radius: 10px;
  margin: 20px 0;
}

.no-items {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.no-items-hint {
  color: #7f8c8d;
  margin-top: 10px;
}

.item-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.item-card.editing {
  border: 2px solid #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

.item-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .item-image {
  transform: scale(1.05);
}

.no-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ecf0f1;
  color: #7f8c8d;
}

.no-image span {
  font-size: 48px;
  margin-bottom: 10px;
}

.item-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.item-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #2c3e50;
  line-height: 1.3;
}

.item-description {
  color: #7f8c8d;
  margin-bottom: 15px;
  line-height: 1.4;
  flex-grow: 1;
}

.item-meta {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #ecf0f1;
}

.item-meta small {
  display: block;
  color: #95a5a6;
  font-size: 12px;
  margin-bottom: 3px;
}

.item-actions {
  padding: 0 20px 20px;
  display: flex;
  gap: 10px;
}

.item-actions .btn {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }
  
  .item-actions {
    flex-direction: column;
  }
}
</style>