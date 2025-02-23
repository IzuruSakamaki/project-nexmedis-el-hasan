<template>
  <div>
    <div v-if="editor" class="flex space-x-2 mb-4">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        Bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        Italic
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        Strike
      </button>
    </div>
    <editor-content :editor="editor" class="border rounded-lg p-4" />
  </div>
</template>

<script setup lang="ts">
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';

  const props = defineProps<{
    modelValue: string;
  }>();

  const emit = defineEmits(['update:modelValue']);
  const editor = useEditor({
    content: props.modelValue,
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      emit('update:modelValue', html);
    },
  });
</script>

<style>
  .is-active {
    background-color: #e2e8f0;
  }
</style>