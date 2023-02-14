<script setup>

import { defineProps, defineEmits } from 'vue';

defineEmits([
    'orderSelected',
])

defineProps({
  orders: Object
})

</script>

<template>
  <div v-for="item in orders" :key="item.id">
    <p @click="$emit('orderSelected',item)">{{ item }}</p>
  </div>
</template>

<style scoped>

</style>
