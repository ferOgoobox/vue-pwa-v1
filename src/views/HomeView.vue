<script setup >
import { onMounted,ref } from 'vue';

const products = ref([])
const productsSearch =  ref('')
const listProducts = ref([])

/*eslint-disable*/
onMounted(async() => {
  fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
      console.log('algo',data.products);
      products.value = data.products
      listProducts.value = [];
      for (let i = 0; i < products.value.length; i++) {
        const element = products.value[i];
        const product = {
          id: element.id,
          title: element.title,
          img: element.thumbnail,
        };
        listProducts.value.push(product);
      }
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

  <ul v-for="product in listProducts" :key="product.id">
    <li >{{ product }}</li>
  </ul>
</template>

<style scoped>
</style>
