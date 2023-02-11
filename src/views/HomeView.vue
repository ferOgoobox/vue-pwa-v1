<script setup>
import axios from 'axios';
import PouchDB from 'pouchdb';
import { ref, onMounted } from 'vue'


// const search = (event) => {
//   const text = event.target.value;
//     productsSearch.value = products.value;
//     if(text && text.trim() != ''){
//       productsSearch.value = products.value.filter((product)=>{
//         return (product.title.toLowerCase().indexOf(text.toLowerCase()) > -1);
//       })
//     }else{
//       productsSearch.value = []
//     }
// }

const items = ref([]);
let db;

  onMounted(() => {
    db = new PouchDB('products');
    loadFromDB();
  })

  const loadProducts = async() => {
    const response = await axios.get('https://dummyjson.com/products');
    const products =  response.data.products;
    products.forEach(async product => {
        await db.put({
        _id: JSON.stringify(product.id),
        title: product.title
      }).then(response => {
        console.log(response)

      }).catch(error => {
        console.log(error)
      })

    });
    loadFromDB();
  }

  const loadFromDB = async() => {
    const docs = await db.allDocs({ include_docs: true });
    items.value = docs.rows.map(row => row.doc);
  }
</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <h1>Productos</h1>
    <button @click="loadProducts">Cargar productos</button>
    <ul>
      <li v-for="item in items" :key="item._id">{{ item.title }}</li>
    </ul>
  </div>
</template>

<style scoped>
</style>


