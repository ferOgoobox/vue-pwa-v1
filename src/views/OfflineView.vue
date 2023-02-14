<script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue'


  const online = ref(false)
  const router = useRouter()

  const sincronizar = () =>{
    console.log('sincronizando...')
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

</script>
<template>
  <div>
    <div v-if="online">
      <h3> Se ha restablecido la conexión, sincroniza y regresa a la vista principal</h3>
      <button @click="sincronizar()">Sincronizar</button>
    </div>
    <h1>This is an offline page</h1>
  </div>
</template>
