<template>
  <div class="p-4 text-white">
   

    
  </div>
</template>

<script setup>
  const supabase = useSupabaseClient()

  const jogadores = ref([{
    id: 1,
    name: 'Matheus Felizardo',
    games: 4,
    goals: 0,
    assistences: 0
  }, {
    id: 2,
    name: 'Fernando Rotert',
    games: 4,
    goals: 0,
    assistences: 0
  }, {
    id: 3,
    name: 'Guilherme Nogueira',
    games: 3,
    goals: 0,
    assistences: 0
  }])

  import { storeToRefs } from 'pinia';
  const { $dataStore } = useNuxtApp()
  const { players } = storeToRefs($dataStore)

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from('players').select('*')
    if (error) console.log(error)
    $dataStore.players = data
  }

  
</script>