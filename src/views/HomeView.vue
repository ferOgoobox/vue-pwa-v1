<script setup >
import { onMounted,ref } from 'vue';

const products = ref([])
const productsSearch =  ref('')

/*eslint-disable*/
onMounted(async() => {
  fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
      products.value = data.products
      console.log(data.products);
    })
    .catch(error => {
      console.error(error);
    });
})

const search = (event) => {
  const text = event.target.value;
    productsSearch.value = products.value;
    if(text && text.trim() != ''){
      productsSearch.value = products.value.filter((product)=>{
        return (product.title.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      productsSearch.value = []
    }

}
/*eslint-disable*/
</script>

<template>
   <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>
      <input type="text"  @input="search($event)"  placeholder="Ingresa el producto">
    </div>
  </div>

  <ul v-for="product in productsSearch" :key="product.id">
    <li >{{ product.title }}</li>
  </ul>
</template>

<style scoped>
</style>
