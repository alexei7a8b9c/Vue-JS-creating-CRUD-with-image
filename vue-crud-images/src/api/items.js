// Mock API с имитацией загрузки изображений
let items = [
  {
    id: 1,
    title: 'Пример товара',
    description: 'Описание товара',
    image: '/uploads/sample.jpg',
    imageUrl: '/uploads/sample.jpg'
  }
];
let nextId = 2;

// Функция для создания URL из File объекта
const createImageUrl = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

// Функция для имитации загрузки файла на сервер
const uploadImage = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // В реальном приложении здесь был бы ответ от сервера с путем к файлу
      const imagePath = `/uploads/${Date.now()}_${file.name}`;
      resolve(imagePath);
    }, 1000);
  });
};

export const itemsAPI = {
  // Получить все элементы
  async getItems() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...items]);
      }, 500);
    });
  },

  // Создать новый элемент
  async createItem(itemData) {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        let imagePath = itemData.image;
        let imageUrl = itemData.imageUrl;
        
        // Если есть файл изображения, имитируем загрузку
        if (itemData.imageFile) {
          imagePath = await uploadImage(itemData.imageFile);
          imageUrl = createImageUrl(itemData.imageFile);
        }

        const newItem = {
          id: nextId++,
          title: itemData.title,
          description: itemData.description,
          image: imagePath,
          imageUrl: imageUrl,
          createdAt: new Date().toISOString()
        };
        items.push(newItem);
        resolve(newItem);
      }, 500);
    });
  },

  // Обновить элемент
  async updateItem(id, itemData) {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          let imagePath = itemData.image || items[index].image;
          let imageUrl = itemData.imageUrl || items[index].imageUrl;
          
          // Если есть новый файл изображения, имитируем загрузку
          if (itemData.imageFile) {
            imagePath = await uploadImage(itemData.imageFile);
            imageUrl = createImageUrl(itemData.imageFile);
          }

          items[index] = { 
            ...items[index], 
            title: itemData.title,
            description: itemData.description,
            image: imagePath,
            imageUrl: imageUrl,
            updatedAt: new Date().toISOString()
          };
          resolve(items[index]);
        } else {
          reject(new Error('Item not found'));
        }
      }, 500);
    });
  },

  // Удалить элемент
  async deleteItem(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          // Очищаем URL если он был создан через createObjectURL
          if (items[index].imageUrl && items[index].imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(items[index].imageUrl);
          }
          items.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error('Item not found'));
        }
      }, 500);
    });
  }
};