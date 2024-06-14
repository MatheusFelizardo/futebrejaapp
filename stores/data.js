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

      const { data: presence, error: presenceError } = await supabase.from('presence').select('*')
      
      this.players = players
      


      const playersStats = players.map((player) => {
        const playerGoals = goals.filter(goal => goal.player_id === player.id)
        const playerAssistences = assistences.filter(assistence => assistence.player_id === player.id)
        const playerOddGoals = oddGoals.filter(oddGoal => oddGoal.player_id === player.id)
        const playerMatches = presence.filter(presence => presence.player_id === player.id)
       
        
        return {
          ...player,
          goals: playerGoals[0]?.amount || 0,
          assistences: playerAssistences[0]?.amount || 0,
          oddGoals: playerOddGoals[0]?.amount || 0,
          games: playerMatches.length,
          points: (playerGoals[0]?.amount || 0) + (playerAssistences[0]?.amount || 0) + (playerOddGoals[0]?.amount || 0)
        }
      })

      this.playersStats = playersStats.sort((a, b) => b.points - a.points)
    },
   
    restartUserStates() {
      this.data = []
    }
  },
})