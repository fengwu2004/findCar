export const parkingdetail = {
  state:{
    emptyCount:0,
    totalCount:0,
    parkingCount:0,
    spaceOverviewList:[]
  },
  mutations: {
  
    SET_PARKING_DETAIL:(state, {emptyCount, totalCount, parkingCount, spaceOverviewList}) => {
      
      state.emptyCount = emptyCount
  
      state.totalCount = totalCount
  
      state.parkingCount = parkingCount
  
      state.spaceOverviewList = spaceOverviewList
    }
  },
  actions:{
  
    setParkingDetail({commit}, data) {
      
      return new Promise(resolve => {
        
        commit('SET_PARKING_DETAIL', data)
  
        resolve()
      })
    }
  }
}
