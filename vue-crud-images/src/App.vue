<template>
  <div class="container">
    <header class="header">
      <h1>🎨 Vue JS: CRUD с изображениями</h1>
      <p class="subtitle">Создание, просмотр, редактирование и удаление элементов с загрузкой изображений</p>
    </header>

    <main>
      <ItemForm
        :editing-item="editingItem"
        :loading="loading"
        @submit="handleFormSubmit"
        @cancel="cancelEdit"
      />

      <ItemList
        :items="items"
        :loading="loading"
        :error="error"
        :editing-item-id="editingItem?.id"
        @edit="startEdit"
        @delete="handleDelete"
        @retry="loadItems"
      />
    </main>

    <!-- Уведомления -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useItems } from './composables/useItems.js';
import ItemForm from './components/ItemForm.vue';
import ItemList from './components/ItemList.vue';

const { items, loading, error, loadItems, createItem, updateItem, deleteItem, cleanup } = useItems();
const editingItem = ref(null);
const notification = ref({
  show: false,
  message: '',
  type: 'success'
});

// Показать уведомление
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

// Загрузка элементов при монтировании
onMounted(() => {
  loadItems();
});

// Очистка при размонтировании
onUnmounted(() => {
  cleanup();
});

// Обработчик отправки формы
const handleFormSubmit = async (formData) => {
  try {
    if (editingItem.value) {
      // Обновление существующего элемента
      await updateItem(editingItem.value.id, {
        title: formData.title,
        description: formData.description,
        imageFile: formData.imageFile
      });
      showNotification('Элемент успешно обновлен!', 'success');
    } else {
      // Создание нового элемента
      await createItem({
        title: formData.title,
        description: formData.description,
        imageFile: formData.imageFile
      });
      showNotification('Элемент успешно создан!', 'success');
    }
    editingItem.value = null;
  } catch (err) {
    console.error('Ошибка при сохранении:', err);
    showNotification('Ошибка при сохранении элемента', 'error');
  }
};

// Начало редактирования
const startEdit = (item) => {
  editingItem.value = { ...item };
};

// Отмена редактирования
const cancelEdit = () => {
  editingItem.value = null;
  showNotification('Редактирование отменено', 'info');
};

// Удаление элемента
const handleDelete = async (id) => {
  if (confirm('Вы уверены, что хотите удалить этот элемент?')) {
    try {
      await deleteItem(id);
      if (editingItem.value && editingItem.value.id === id) {
        editingItem.value = null;
      }
      showNotification('Элемент успешно удален!', 'success');
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      showNotification('Ошибка при удалении элемента', 'error');
    }
  }
};
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background: linear-gradient(135deg, #249c3eff 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: #27ae60;
}

.notification.error {
  background: #e74c3c;
}

.notification.info {
  background: #3498db;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
    padding: 0 20px;
  }
  
  .notification {
    left: 20px;
    right: 20px;
    text-align: center;
  }
}
</style>