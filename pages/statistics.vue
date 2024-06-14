<template>
  <div class="p-4 text-white">

    <div class="flex gap-4 mb-8">
      <nuxt-link to="/" class="text-xs p-1 bg-[#ffd504] text-black font-bold">Homepage</nuxt-link>
      <nuxt-link to="/new_game" class="text-xs p-1 bg-[#ffd504] text-black font-bold">Iniciar partida</nuxt-link>
    </div>

  
    <h1 class="text-2xl">Classificação</h1>
    <p class="text-xs mb-6">P: pontos | J: jogos | G: Gols | A: Assistências | GC: Gols contra</p>

    <div>
      <div class="flex mb-2">
        <span class=" w-6/12">Jogador</span>
        <span class=" w-1/12 text-center">P</span>
        <span class=" w-1/12 text-center">J</span>

        <span class=" w-1/12 text-center">G</span>
        <span class=" w-1/12 text-center">A</span>
        <span class=" w-1/12 text-center">GC</span>

      </div>

      <div v-for="player in players" :key="player.id"  class="flex">
        <p class=" w-6/12 truncate"> {{ player.name }} </p>
        <p class=" w-1/12 text-center"> {{player.games}} </p>
        <p class=" w-1/12 text-center"> {{player.goals}} </p>
        <p class=" w-1/12 text-center"> {{player.assistences}} </p>
        <p class=" w-1/12 text-center"> {{player.odd_goals}} </p>
        <span class=" w-1/12 text-center">{{player.goals + player.assistences - player.odd_goals }}</span>

      </div>

    </div>

    
  </div>
</template>

<script setup>
  const supabase = useSupabaseClient()
  import { storeToRefs } from 'pinia';
  const { $dataStore } = useNuxtApp()
  const { players } = storeToRefs($dataStore)

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from('players').select('*')
    if (error) console.log(error)
    $dataStore.players = data
  }

  onMounted(async () => {
    await $dataStore.getPlayersInfo()
  })

  
</script>