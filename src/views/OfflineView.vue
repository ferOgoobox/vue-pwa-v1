<script setup>
  import { useRouter } from 'vue-router';
  import { ref, onMounted} from 'vue';
  import { nanoid } from 'nanoid';
  // import PouchDB from 'pouchdb';



  const items = ref([]);
  const productsSearch = ref([])
  const online = ref(false)
  const router = useRouter()
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



  const sincronizar = () =>{
    console.log('sincronizando......')
    router.push('/')
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
  <div>
    <div v-if="online">
      <h3> Se ha restablecido la conexión, sincroniza y regresa a la vista principal</h3>
      <button @click="sincronizar()">Sincronizar</button>
    </div>
    <h1>This is an offline page</h1>
    <h2>Productos</h2>
    <!-- <div>
      <button @click="loadProducts">Cargar productos</button>
    </div> -->
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
