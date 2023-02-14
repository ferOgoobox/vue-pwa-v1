<script setup>
import { defineProps } from 'vue';

defineProps({
    orders: Object,
})

</script>

<template>
  <div>

    <p v-for="item in orders" :key="item.id">
        {{  item  }}
    </p>
  </div>
</template>

<style scoped>
</style>