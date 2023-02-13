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



      // db.get('products_01').then(function(doc) {
      //   console.log('ya existe', doc._rev);
      //   doc.products = response.data.products;
      //   return db.put(doc);
      // }).catch(function (err) {
      //   console.log('no existe',err);
      //   return db.put({
      //     _id: 'products_01',
      //     products: response.data.products
      //   });
      // }).then(function(response) {
      //   console.log(response);
      // }).catch(function (err) {
      //   console.log(err);
      // });


      // db.get('products_01').then(function (doc) {
      //   console.log('ya existe')
      //   doc.products = response.data.products;
      //   return db.put(
      //     doc
      //   ).then(function () {
      //         return db.get('products_01');
      //   }).then(function (doc) {
      //         console.log(doc);
      //   });
      // }).catch(async err=> {
      //   console.log('Es nueva', err)
      //   await db.put({
      //     _id: 'products_01',
      //     products: response.data.products,
      //   }).then(response => {
      //     console.log('response', response)
      //   }).catch(error => {
      //     console.log('Error al guardar en pouchDB ',error)
      //   })
      // })



        // await db.put({
        //   _id: 'products',
        //   products: response.data.products,
        // }).then(response => {
        //   console.log('response', response)
        // }).catch(error => {
        //   console.log('Error al guardar en pouchDB ',error)
        // })
      // products.forEach(async product => {
      //     await db.put({
      //     _id: JSON.stringify(product.id),
      //     title: product.title,
      //   }).catch(error => {
      //     console.log('Error al guardar en pouchDB ',error)
      //   })
      // });
    })
    .catch(async err => {
      console.log(err)
      const docs = await db.allDocs({ include_docs: true });
      items.value = docs.rows.map(row => row.doc);
      console.log("🚀 ~ file: HomeView.vue:108 ~ loadProducts ~ items.value ", items.value )
      console.log('Toma lo productos de pouchDB')
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
    {{ }}
    <ul v-if="items.length !== 0">
      <li v-for="item in productsSearch" :key="item._id">{{ item.title }}</li>
    </ul>
    <p v-else>No hay producos descargados</p>
  </div>
</template>

<style scoped>
</style>


