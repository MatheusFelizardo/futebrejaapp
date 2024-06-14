<template>
  <div class="p-4 text-white">

    <div class="flex gap-4 mb-8">
      <nuxt-link to="new_game" class="text-xs p-1 bg-[#ffd504] text-black font-bold">Iniciar partida</nuxt-link>
      <nuxt-link class="text-xs p-1 bg-[#ffd504] text-black font-bold">Estatísticas</nuxt-link>
    </div>

    <div v-if="!players.length" class="flex gap-2">
      <SpinIcon class="animate-spin w-6 h-6" /> 
      <span>Loading...</span>
    </div>

  
    <div v-else>
      <h1 class="text-2xl">Classificação</h1>
      <p class="text-xs mb-6">P: pontos | J: jogos | G: Gols | A: Assistências | GC: Gols contra</p>

      <div>
        <div class="flex mb-2 justify-between">
          <span class=" w-6/12">Jogador</span>
          <span class=" w-1/12 text-center">P</span>
          <span class=" w-1/12 text-center">J</span>

          <span class=" w-1/12 text-center">G</span>
          <span class=" w-1/12 text-center">A</span>
          <span class=" w-1/12 text-center">GC</span>

        </div>

        <div v-for="player in playersStats" :key="player.id"  class="flex justify-between">
          <p class=" w-6/12 truncate"> {{ player.name }} </p>
          <p class=" w-1/12 text-center"> {{player.games || 0}} </p>
          <p class=" w-1/12 text-center"> {{player.goals || 0}} </p>
          <p class=" w-1/12 text-center"> {{player.assistences || 0}} </p>
          <p class=" w-1/12 text-center"> {{player.odd_goals || 0}} </p>
          <span class=" w-1/12 text-center">{{player.goals + player.assistences - player.odd_goals || 0 }}</span>

        </div>

      </div>
    </div>

    
  </div>
</template>

<script setup>
  const supabase = useSupabaseClient()
  import { storeToRefs } from 'pinia';
  import SpinIcon from '~/assets/img/icons/SpinIcon.vue';
  const { $dataStore } = useNuxtApp()
  const { players, playersStats } = storeToRefs($dataStore)

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from('players').select('*')
    if (error) console.log(error)
    $dataStore.players = data
  }

  onMounted(async () => {
    await $dataStore.getPlayersInfo()

    console.log(playersStats.value)
  })

  
</script>