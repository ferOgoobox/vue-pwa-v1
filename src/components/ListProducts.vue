<script setup>

import { defineProps, defineEmits } from 'vue';

defineEmits([
    'productSelected',
])

defineProps({
  products: Object
})

</script>

<template>
  <ul v-for="item in products" :key="item.id">
    <li @click="$emit('productSelected',item)">{{ item.title }}</li>
  </ul>
</template>

<style scoped>

</style>
