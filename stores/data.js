import { defineStore } from 'pinia'
import axios from '../plugins/axios'
export const useDataStore = defineStore('data', {
  state: () => (
    {
      players: [],
      playersStats: [],
      match: {},
    }
  ),
  getters: {
  },
  actions: {
    async getPlayersInfo() {
      const supabase = useSupabaseClient()

      const { data: players, error: playersError } = await supabase.from('players').select('*').order('name', { ascending: true })
      const { data: goals, error: goalsError } = await supabase.from('goals').select('*')
      const { data: assistences, error: assistencesError } = await supabase.from('assistences').select('*')
      const { data: oddGoals, error: oddGoalsError } = await supabase.from('odd_goals').select('*')

      if (playersError || goalsError || assistencesError || oddGoalsError) {
        console.log(playersError, goalsError, assistencesError, oddGoalsError)
      }

      this.players = players

      const playersStats = players.map(player => {
        const playerGoals = goals.filter(goal => goal.player_id === player.id)
        const playerAssistences = assistences.filter(assistence => assistence.player_id === player.id)
        const playerOddGoals = oddGoals.filter(oddGoal => oddGoal.player_id === player.id)

        return {
          ...player,
          goals: playerGoals.length,
          assistences: playerAssistences.length,
          oddGoals: playerOddGoals.length,
        }
      })

      this.playersStats = playersStats
    },
   
    restartUserStates() {
      this.data = []
    }
  },
})