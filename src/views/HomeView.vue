<script setup>
import axios from 'axios';
import PouchDB from 'pouchdb';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { nanoid } from 'nanoid';
// import moment from 'moment';
// import List from '@/components/List.vue';
import ListComponent from '@/components/ListComponent.vue';
import ListProducts from '@/components/ListProducts.vue';

const items = ref([]);
const productsSearch = ref([])
const online = ref(false)
// const router = useRouter()
const myOrders = ref([])
const orderForAdd = ref([])
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
      }).catch(function (err) {
        console.log('nueva', err)
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
      }).catch(function (err) {
        console.error(err);
      })
    })
  }

  // const loadFromDB = async() => {
  //   const docs = await db.allDocs({ include_docs: true });
  //   items.value = docs.rows.map(row => row.doc);

  const search = (event) => {
    console.log('entra a search')
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

  const createOrder = () => {
    // const order = {'id': nanoid(6), 'client': 'Publico en general', 'estatus': 'Pendiente', 'date': moment().format() , 'total': 0, 'products': [] }
    const order = {'id': nanoid(6),'products': [] }
    myOrders.value.push((order))
  }

  const orderSelected = (order) => {
    orderForAdd.value = myOrders.value.find(x => x.id == order.id)
  }

  const productSelected = (product) => {
    let valor = myOrders.value.find(x => x.id == orderForAdd.value.id)
    let index = myOrders.value.indexOf(x => x.id == orderForAdd.value.id)
    valor.products.push(product.title)
    myOrders.value[index] = valor
  }



  // Detectar cambios de conexión
  function isOnline() {
    if ( navigator.onLine ) {
       online.value = true
    } else{
       online.value = false
       //router.push("/offline")
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
    <div>
      <button @click="loadProducts">Cargar productos</button>
    </div>
    <p v-if="orderForAdd">{{ orderForAdd.id }}</p>
    <input type="text" @input="search($event)" placeholder="Ingresa un producto">
    <button @click="createOrder">Crear Pedido</button>
    <div v-if="items.length !== 0">
      <ListProducts :products="productsSearch" @productSelected="productSelected"></ListProducts>
    </div>
    <p v-else>No hay producos descargados</p>
  </div>

  <div>
    <!-- <List :orders="myOrders"></List> -->
    <ListComponent :orders="myOrders" @orderSelected="orderSelected"></ListComponent>
  </div>
</template>

<style scoped>
</style>


