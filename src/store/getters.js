const getters = {
  searchCarWithPlate: state => state.map.searchCarWithPlate,
  markInMap: state => state.map.markInMap,
  searchCarWithUnit: state => state.map.searchCarWithUnit,
  inNavi: state => state.map.inNavi,
  mapState: state => state.map,
  navigation: state => state.navigation,
  parkingdetail:state => state.parkingdetail,
}
export default getters
