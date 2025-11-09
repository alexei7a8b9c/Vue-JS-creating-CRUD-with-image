<template>
  <div class="image-upload-container">
    <div 
      class="image-upload"
      @click="triggerFileInput"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <div v-if="!previewUrl">
        <p>Перетащите изображение сюда или кликните для выбора</p>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept="image/*"
          style="display: none"
        />
      </div>
      <div v-else>
        <img :src="previewUrl" alt="Preview" class="image-preview" />
        <button @click.stop="removeImage" class="btn btn-danger">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: File | null
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);
const previewUrl = ref('');
const currentFile = ref(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    processFile(file);
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processFile(file);
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.currentTarget.style.borderColor = '#3498db';
};

const handleDragLeave = (event) => {
  event.preventDefault();
  event.currentTarget.style.borderColor = '#ddd';
};

const processFile = (file) => {
  currentFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  emit('update:modelValue', file);
};

const removeImage = () => {
  currentFile.value = null;
  previewUrl.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('update:modelValue', null);
};

// Очистка URL при размонтировании
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>