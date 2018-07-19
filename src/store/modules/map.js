export const map = {
  state:{
    searchCarWithPlate:false,
    markInMap:false,
    searchCarWithUnit:false,
    inNavi:false,
    showFacilityPanel:false,
    regionEx:null,
  },
  mutations: {
  
    SEARCHCAR_WITH_PLATE_NUMBER:(state, value)=> {
      
      state.searchCarWithPlate = value
    },
    SEARCHCAR_WITH_UNIT:(state, value)=> {
    
      state.searchCarWithUnit = value
    },
    MARK_IN_MAP:(state, value)=> {
    
      state.markInMap = value
    },
  },
  actions:{
    
    startSearchCarByPlateNumber({commit}) {
    
      return new Promise(resolve => {
  
        commit('SEARCHCAR_WITH_PLATE_NUMBER', true)
  
        resolve()
      })
    },
    finishSearchCarByPlateNumber({commit}) {
  
      return new Promise(resolve => {
  
        commit('SEARCHCAR_WITH_PLATE_NUMBER', false)
    
        resolve()
      })
    },
    startSearchCarByUnit({commit}) {
  
      return new Promise(resolve => {
  
        commit('SEARCHCAR_WITH_UNIT', true)
    
        resolve()
      })
    },
    finishSearchCarByUnit({commit}) {
  
      return new Promise(resolve => {
  
        commit('SEARCHCAR_WITH_UNIT', false)
    
        resolve()
      })
    },
    startMarkInMap({commit}) {
  
      return new Promise(resolve => {
  
        commit('MARK_IN_MAP', true)
    
        resolve()
      })
    },
    finishMarkInMap({commit}) {
  
      return new Promise(resolve => {
  
        commit('MARK_IN_MAP', false)
    
        resolve()
      })
    },
  }
}
