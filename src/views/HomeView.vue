<script setup>
import axios from 'axios';
import PouchDB from 'pouchdb';
import { ref, onMounted } from 'vue'




const items = ref([]);
const productsSearch = ref([])
const online = ref(false)
let db;

  onMounted(() => {
    db = new PouchDB('products');
  })

  const loadProducts = async() => {
    await axios.get('https://dummyjson.com/products')
    .then(response => {
      items.value = response.data.products
      const products =  response.data.products;
      products.forEach(async product => {
          await db.put({
          _id: JSON.stringify(product.id),
          title: product.title
        }).catch(error => {
          console.log('Error al guardar en pouchDB',error)
        })
      });
    })
    .catch(async err => {
      console.log(err)
      const docs = await db.allDocs({ include_docs: true });
      items.value = docs.rows.map(row => row.doc);
      console.log('Vientos')
    })
  }

  // const loadFromDB = async() => {
  //   const docs = await db.allDocs({ include_docs: true });
  //   items.value = docs.rows.map(row => row.doc);
  // }

  const search = (event) => {
    console.log('entrasearch')
    const text = event.target.value;
    productsSearch.value = items.value;
    if(text && text.trim() != ''){
      productsSearch.value = items.value.filter((product)=>{
        return (product.title.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      productsSearch.value = []
    }
  }

  // Detectar cambios de conexión
  function isOnline() {
    if ( navigator.onLine ) {
       online.value = true
    } else{
       online.value = false
    }
  }

  window.addEventListener('online', isOnline );
  window.addEventListener('offline', isOnline );

  isOnline();
</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h4 v-if="online">Online</h4>
    <h4 v-else>Offline</h4>

    <h1>Productos</h1>
    <input type="text" @input="search($event)" placeholder="Ingresa un producto">
    <button @click="loadProducts">Cargar productos</button>
    <ul>
      <li v-for="item in productsSearch" :key="item._id">{{ item.title }}</li>
    </ul>
  </div>
</template>

<style scoped>
</style>


