export const navigation = {
  state:{
    start:false,
    totalDistance:0,
    nextdir:'',
    nextDistance:0,
    findCar:false,
    enableSpeack:true,
    statusValid:false
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
  
      state.statusValid = false
    },
    SET_NAVI_STATUS:(state, {totalDistance, nextdir, nextDistance})=> {
      
      state.totalDistance = totalDistance
  
      state.nextdir = nextdir
  
      state.nextDistance = nextDistance
      
      state.statusValid = true
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
