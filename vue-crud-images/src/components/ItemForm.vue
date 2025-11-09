<template>
  <div class="form-container">
    <h2>{{ editingItem ? 'Редактировать элемент' : 'Создать новый элемент' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Название:</label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          required
          placeholder="Введите название"
        />
      </div>

      <div class="form-group">
        <label for="description">Описание:</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Введите описание"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Изображение:</label>
        
        <!-- Отображение текущего изображения при редактировании -->
        <div v-if="editingItem && editingItem.imageUrl && !form.imageFile" class="current-image">
          <p>Текущее изображение:</p>
          <img :src="editingItem.imageUrl" :alt="editingItem.title" class="image-preview" />
        </div>

        <ImageUpload v-model="form.imageFile" />
        
        <div v-if="form.imageFile" class="new-image-notice">
          <small>Будет загружено новое изображение</small>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading">Загрузка...</span>
          <span v-else>{{ editingItem ? 'Обновить' : 'Создать' }}</span>
        </button>
        <button 
          type="button" 
          class="btn btn-danger" 
          @click="resetForm"
          v-if="editingItem"
        >
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
import ImageUpload from './ImageUpload.vue';

const props = defineProps({
  editingItem: Object,
  loading: Boolean
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  title: '',
  description: '',
  imageFile: null
});

// Обработчик отправки формы
const handleSubmit = () => {
  emit('submit', { ...form });
};

// Сброс формы
const resetForm = () => {
  form.title = '';
  form.description = '';
  form.imageFile = null;
  emit('cancel');
};

// Наблюдаем за изменением редактируемого элемента
watch(() => props.editingItem, (newItem) => {
  if (newItem) {
    form.title = newItem.title;
    form.description = newItem.description;
    form.imageFile = null; // Сбрасываем файл при начале редактирования
  } else {
    resetForm();
  }
}, { immediate: true });
</script>

<style scoped>
.current-image {
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.current-image p {
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

.new-image-notice {
  margin-top: 10px;
  color: #27ae60;
  font-style: italic;
}

.image-preview {
  max-width: 200px;
  max-height: 150px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>