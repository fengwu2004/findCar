export const navigation = {
  state:{
    start:false,
    totalDistance:0,
    nextLeft:false,
    nextDistance:0,
    findCar:false,
    enableSpeack:true
  },
  mutations: {
    
    START:(state, value)=> {
      
      state.start = true
      
      state.findCar = value
    },
    TOGGLE_SPEAK:(state)=> {
    
      state.enableSpeack = !state.enableSpeack
    },
    STOP:(state)=> {
    
      state.start = false
    },
    SET_NAVI_STATUS:(state, {totalDistance, nextLeft, nextDistance})=> {
      
      state.totalDistance = totalDistance
  
      state.nextLeft = nextLeft
  
      state.nextDistance = nextDistance
    },
  },
  actions:{
    
    startNavigation({commit}, value) {
      
      return new Promise(resolve => {
        
        commit('START', value)
        
        resolve()
      })
    },
    stopNavigation({commit}) {
    
      return new Promise(resolve => {
      
        commit('STOP')
      
        resolve()
      })
    },
    setNaviStatus({commit}, data) {
      
      return new Promise(resolve => {
        
        commit('SET_NAVI_STATUS', data)
        
        resolve()
      })
    },
    toggleSpeak({commit}) {
  
      return new Promise(resolve => {
    
        commit('TOGGLE_SPEAK')
    
        resolve()
      })
    }
  }
}
