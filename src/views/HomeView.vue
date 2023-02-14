<script setup>
import axios from 'axios';
import PouchDB from 'pouchdb';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const items = ref([]);
const productsSearch = ref([])
const online = ref(false)
const router = useRouter()
let db;

  onMounted(() => {
    db = new PouchDB('products');
    db.get('products').then(async function (doc) {
        items.value = await doc.products;
      }).catch(err => {
        console.log('No hay productos descargados', err)
      })
  })

  const loadProducts = async() => {
    await axios.get('https://dummyjson.com/products')
    .then(async response => {
      items.value = response.data.products
      console.log("🚀 ~ file: HomeView.vue:22 ~ loadProducts ~ items.value 11", items.value)
      db.get('products').then(function(doc) {
        db.compact().then(function (result) {
          console.log('Base de datos comprimida exitosamente',result);
        }).catch(function (err) {
          console.error('Error al comprimir la base de datos: ', err);
        });
        return db.put({
          _id: 'products',
          _rev: doc._rev,
          products: response.data.products
        });
      }).then(function(response) {
        console.log("🚀 ~ file: HomeView.vue:30 ~ db.get ~ response", response)
        // handle response
      }).catch(function (err) {
        console.log('nuevaaa', err)
        return db.put({
          _id: 'products',
          products: response.data.products
        });
      });
    })
    .catch(async err => {
      console.log('Toma lo productos de pouchDB', err)
      db.get('products').then(function (doc) {
        items.value = doc.products;
        console.log(items.value)
      }).catch(function (err) {
        console.error(err);
      })
    })
  }

  // const loadFromDB = async() => {
  //   const docs = await db.allDocs({ include_docs: true });
  //   items.value = docs.rows.map(row => row.doc);

  const search = (event) => {
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
       router.push("/offline")

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
    <ul v-if="items.length !== 0">
      <li v-for="item in productsSearch" :key="item._id">{{ item.title }}</li>
    </ul>
    <p v-else>No hay producos descargados</p>
  </div>
</template>

<style scoped>
</style>


