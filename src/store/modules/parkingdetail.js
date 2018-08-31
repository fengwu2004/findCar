export const parkingdetail = {
  state:{
    emptyCount:0,
    totalCount:0,
    parkingCount:0,
    spaceList:[],
    spaceOverviewList:[],
    valid:false
  },
  mutations: {
  
    SET_PARKING_DETAIL:(state, {emptyCount, totalCount, parkingCount, spaceList, spaceOverviewList}) => {
      
      state.emptyCount = emptyCount
  
      state.totalCount = totalCount
      
      state.spaceList = spaceList
  
      state.parkingCount = parkingCount
  
      state.valid = true
      
      for (let i = 0; i < spaceOverviewList.length; ++i) {
  
        spaceOverviewList[i].level = 999
        
        if (spaceOverviewList[i].areaName.indexOf('临时') != -1) {
  
          spaceOverviewList[i].level = 0
        }
  
        if (spaceOverviewList[i].areaName.indexOf('充电桩') != -1) {
    
          spaceOverviewList[i].level = 1
        }
  
        if (spaceOverviewList[i].areaName.indexOf('VIP') != -1) {
    
          spaceOverviewList[i].level = 2
        }
  
        if (spaceOverviewList[i].areaName.indexOf('企业') != -1) {
    
          spaceOverviewList[i].level = 3
        }
  
        if (spaceOverviewList[i].areaName.indexOf('酒店') != -1) {
    
          spaceOverviewList[i].level = 4
        }
  
        if (spaceOverviewList[i].areaName.indexOf('月租') != -1) {
    
          spaceOverviewList[i].level = 5
        }
      }
      
      spaceOverviewList.sort((a, b)=>{
        
        return a.level > b.level
      })
      
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
