<template>
  <div class="p-4 text-white max-w-screen-sm">

    <div class="flex gap-4 mb-8">
      <nuxt-link to="/" class="text-xs p-1 bg-[#ffd504] text-black font-bold">Homepage</nuxt-link>
      <nuxt-link to="statistics" class="text-xs p-1 bg-[#ffd504] text-black font-bold">Estatísticas</nuxt-link>
    </div>

    <div v-if="loading" class="flex gap-2">
      <SpinIcon class="animate-spin w-6 h-6" /> 
      <span>Loading...</span>
    </div>

  
    <div v-else>
      <div class="flex justify-between  mb-6">
        <h1 class="text-2xl">Partida {{match.title || new Date().toLocaleDateString() }}</h1> 
        <button v-if="hasMatch" @click="deleteMatch" class="text-xs p-1 bg-red-500 text-white font-bold">DELETE MATCH</button>
      </div>

      <div v-if="!hasMatch">
        <h1 class="mb-2 text-lg">Quem vai jogar?</h1>

        <div class="flex flex-wrap gap-2">
          <div v-for="player in playersStats" :key="player" class="flex w-[48%] items-center gap-2">
            <input class="w-4 h-4" type="checkbox" :id="player.id" @change="togglePlayer(player.id)">
            <label :for="player.id" class="truncate">{{ player.name }}</label>
          </div>
        </div>

        <button @click="startMatch" class="mt-8 text-xs p-1 bg-[#ffd504] text-black font-bold">Iniciar partida</button>

      </div>

      <div v-else>
        <div class="flex mb-2 gap-4  border-b border-gray-200 pb-2">
          <span class=" w-5/12">Jogador</span>
          <span class="text-center w-3/12">G</span>
          <span class="text-center w-3/12">A</span>
          <span class="text-center w-3/12">GC</span>
        </div>

        <div v-for="player in playersStatsForThisMatch" :key="player.id"  class="flex gap-4 items-center mb-2 border-b border-gray-200 pb-2">
          <div class=" w-5/12"> 
            <div class="text-xs leading-none">{{ player.name }}</div>
          </div>
          <div class="w-3/12 text-center flex gap-1 items-center justify-between">
            <button @click="removeGoal(player.player_id)" class="leading-none p-1 minus"></button>
            <div>{{player.goals}}</div>
            <button @click="addGoal(player.player_id)" class="leading-none p-1 plus"></button>
          </div>
          <div class=" w-3/12 text-center flex gap-1 items-center justify-between">
            <button @click="removeAssistence(player.player_id)" class="leading-none p-1 minus"></button>
            <div>{{player.assistences}}</div>
            <button @click="addAssistence(player.player_id)" class="leading-none p-1 plus"></button>
          </div>
          <div class=" w-3/12 text-center flex gap-1 items-center justify-between">
            <button @click="removeOddGoal(player.player_id)" class="leading-none p-1 minus"></button>
            <div>{{player.odd_goals}}</div>
            <button @click="addOddGoal(player.player_id)" class="leading-none p-1 plus"></button>
          </div>
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
  const { players, match, playersStats } = storeToRefs($dataStore)
  const loading = ref(true)
  const errorMessage = ref('')
  const selectedPlayersForThisMatch = ref([])
  const playersStatsForThisMatch = ref([])
  const hasMatch = ref(false)

  onMounted(async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigateTo('/login')
    }

    if (!players.value.length) {
      await $dataStore.getPlayersInfo()
    }

    const { data: matchData, error: matchError } = await supabase.from('matches').select('*').eq('title', new Date().toLocaleDateString())

    if (matchError) {
      console.log(matchError)
      loading.value = false
      return
    }

    if (!matchData.length) {
      loading.value = false
      return
    }

    $dataStore.match = matchData[0]
    hasMatch.value = matchData[0]

    const { data: goals, error: goalsError } = await supabase.from('goals').select('*').eq('match_id', matchData[0].id)
    const { data: assistences, error: assistencesError } = await supabase.from('assistences').select('*').eq('match_id', matchData[0].id)
    const { data: oddGoals, error: oddGoalsError } = await supabase.from('odd_goals').select('*').eq('match_id', matchData[0].id)

    if (goalsError || assistencesError || oddGoalsError) {
      console.log(goalsError, assistencesError, oddGoalsError)
      loading.value = false
    }

    const { data: presence, error: presenceError} = await supabase.from('presence').select('*').eq('match_id', matchData[0].id)

    if (presenceError) {
      console.log(presenceError)
      loading.value = false
    }

    const playersInMatch = presence.map(p => p.player_id)
    selectedPlayersForThisMatch.value = players.value.filter(player => playersInMatch.includes(player.id))

    for (let player of selectedPlayersForThisMatch.value) {
      const playerGoals = goals.filter(goal => goal.player_id === player.id)
      const playerAssistences = assistences.filter(assistence => assistence.player_id === player.id)
      const playerOddGoals = oddGoals.filter(oddGoal => oddGoal.player_id === player.id)

      playersStatsForThisMatch.value.push({
        player_id: player.id,
        name: player.name,
        match_id: matchData[0].id,
        goals: playerGoals[0]?.amount || 0,
        assistences: playerAssistences[0]?.amount || 0,
        odd_goals: playerOddGoals[0]?.amount || 0
      })
    }

    loading.value = false
  })

  const togglePlayer = (player_id) => {
    const player = players.value.find(player => player.id === player_id)

    if (selectedPlayersForThisMatch.value.includes(player)) {
      selectedPlayersForThisMatch.value = selectedPlayersForThisMatch.value.filter(selectedPlayer => selectedPlayer.id !== player_id)
    } else {
      selectedPlayersForThisMatch.value.push(player)
    }
  }

  const startMatch = async () => {
    const { data, error } = await supabase.from('matches').insert([{ title: new Date().toLocaleDateString() }]).select()
    if (error) {
      console.log(error)
    }
    const {data:presence, error:presenceError} = await supabase.from('presence').insert(selectedPlayersForThisMatch.value.map(player => ({ player_id: player.id, match_id: data[0].id })))
    
    $dataStore.match = data[0]

    for (let player of selectedPlayersForThisMatch.value) {
      playersStatsForThisMatch.value.push({
        player_id: player.id,
        name: player.name,
        match_id: data[0].id,
        goals: 0,
        assistences: 0,
        odd_goals: 0
      })
    }

    hasMatch.value = data
  }

  const addGoal = async (player_id) => {
    const player = findPlayerInThisMatch(player_id)
    const { data, error } = await supabase.from('goals').upsert(
      [{ player_id, match_id: match.value.id, amount: player.goals + 1 }],
      { onConflict: ['player_id', 'match_id'] }
    )

    player.goals++
  }

  const removeGoal = async (player_id) => {
    const player = findPlayerInThisMatch(player_id)
    if (player.goals === 0) return

    const { data, error } = await supabase.from('goals').upsert(
      [{ player_id, match_id: match.value.id, amount: player.goals - 1 }],
      { onConflict: ['player_id', 'match_id'] }
    )

    player.goals--
  }

  const addAssistence = async (player_id) => {
    const player = findPlayerInThisMatch(player_id)

    const { data, error } = await supabase.from('assistences').upsert(
      [{ player_id, match_id: match.value.id, amount: player.assistences + 1 }],
      { onConflict: ['player_id', 'match_id'] }
    )

    player.assistences++
  }

  const removeAssistence = async (player_id) => {
    const player = findPlayerInThisMatch(player_id)
    if (player.assistences === 0) return

    const { data, error } = await supabase.from('assistences').upsert(
      [{ player_id, match_id: match.value.id, amount: player.assistences - 1 }],
      { onConflict: ['player_id', 'match_id'] }
    )
    player.assistences--
  }

  const addOddGoal = async (player_id) => {
    const player = findPlayerInThisMatch(player_id)

    const { data, error } = await supabase.from('odd_goals').upsert(
      [{ player_id, match_id: match.value.id, amount: player.odd_goals + 1 }],
      { onConflict: ['player_id', 'match_id'] }
    )

    player.odd_goals++
  }

  const removeOddGoal = async (player_id) => {
    const player = findPlayerInThisMatch(player_id)
    if (player.odd_goals === 0) return

    const { data, error } = await supabase.from('odd_goals').upsert(
      [{ player_id, match_id: match.value.id, amount: player.odd_goals - 1 }],
      { onConflict: ['player_id', 'match_id'] }
    )

    player.odd_goals--
  }

  const findPlayerInThisMatch = (player_id) => {
    return playersStatsForThisMatch.value.find(player => player.player_id === player_id)
  }

  const deleteMatch = async () => {
    const confirm = window.confirm('Tem certeza que deseja deletar a partida? Todos os dados serão perdidos permanentemente.')
    if (!confirm) return

    const { data, error } = await supabase.from('matches').delete().eq('id', match.value.id)
    if (error) {
      console.log(error)
    }

    hasMatch.value = false
  }

  
</script>

<style scoped>
  .plus, .minus {
    width: 20px;
    height: 20px;
    position: relative;
    background: #ffd504;
    border-radius: 50%;
  }

  .plus::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 50%;
    background-color: black;
    z-index: 2;
  }

  .plus::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 2px;
    background-color: black;
    z-index: 2;
  }

  .minus::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 2px;
    background-color: black;
    z-index: 2;
  }

</style>