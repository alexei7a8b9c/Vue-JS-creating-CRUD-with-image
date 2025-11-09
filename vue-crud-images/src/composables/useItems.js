import { ref } from 'vue';
import { itemsAPI } from '../api/items.js';

export function useItems() {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Загрузка всех элементов
  const loadItems = async () => {
    loading.value = true;
    error.value = null;
    try {
      items.value = await itemsAPI.getItems();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Создание элемента
  const createItem = async (itemData) => {
    loading.value = true;
    error.value = null;
    try {
      const newItem = await itemsAPI.createItem(itemData);
      items.value.push(newItem);
      return newItem;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Обновление элемента
  const updateItem = async (id, itemData) => {
    loading.value = true;
    error.value = null;
    try {
      const updatedItem = await itemsAPI.updateItem(id, itemData);
      const index = items.value.findIndex(item => item.id === id);
      if (index !== -1) {
        // Очищаем старый URL если он был blob
        if (items.value[index].imageUrl && items.value[index].imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(items.value[index].imageUrl);
        }
        items.value[index] = updatedItem;
      }
      return updatedItem;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Удаление элемента
  const deleteItem = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await itemsAPI.deleteItem(id);
      const index = items.value.findIndex(item => item.id === id);
      if (index !== -1) {
        items.value.splice(index, 1);
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Очистка blob URL при размонтировании
  const cleanup = () => {
    items.value.forEach(item => {
      if (item.imageUrl && item.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(item.imageUrl);
      }
    });
  };

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    cleanup
  };
}