// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { indoorun } from '../../indoorunMap/map.js'

import publicfacilitydiv from './components/publicfacility'
import FindFacilityView from './findfacility'
import NormalBottomBar from './normalbottombar'
import AlertBox from './AlertBox'
import bottombar from './components/bottombar'
import UpdateMarkerView from './updatemarkerview'
import ErrorTipView from './errortipview'
import ZoomView from './zoomview'

import floorlistdiv from './components/floorList.vue'
import markwithble from './components/markwithble.vue'
import emptyspace from './components/emptyspace.vue'
import locatestatediv from './components/locatestatus.vue'
import navigation from './components/navigation.vue'
import findwithnum from './components/findWithNum.vue'
import findwithunit from './components/findWithUnit.vue'
import FindCarBtn from "./components/findCarBtn";


var config = require('../config')

Vue.config.productionTip = false

window.debugtest = false

var regionId = '15313792400143094'

var idrMapView = indoorun.idrMapView

var map = new idrMapView()

map.publicPath = config.publicPath

var floorListView = null

var emptySpaceView = null

var locateStatusView = null

var _findFacilityBtn = null

var _navigation = null

var normalBottomBar = null

var updateMarkerView = null

var emptySpaceTimer = null

var emptyUnits = []

var targetUnit = null

var startEmptyNavi = false

var errortipview = new ErrorTipView()

var alertboxview = null

var zoomView = null

var endMarker = null

// indoorun.idrDebug.showDebugInfo(false)

function enableClickMarker() {

  map.addOnceEvent(map.eventTypes.onMarkerClick, marker => {

    if (marker.id != endMarker.id || endMarker.className !== 'IDRCarMarker') {

      return false
    }

    map.centerPos(marker.position, false)

    showUpdateMarkerView(true, marker)

    map.addOnceEvent(map.eventTypes.onMapScroll, () => {

      showUpdateMarkerView(false, null)

      return true
    })

    return true
  })
}

map.addEventListener(map.eventTypes.onMapScroll, () => {

  if (!locateStatusView) {

    return
  }

  locateStatusView.dolocate = false
})

function onMapClick(pos) {
  
  if (window.debugtest) {
    
    map.setUserPos(pos)
  }
}

map.addEventListener(map.eventTypes.onMapClick, pos => {
  
  onMapClick(pos)
})

function addCarMarker(unit) {

  var pos = unit.getPos()

  indoorun.idrNetworkInstance.saveMarkedUnit(unit, null, null)

  endMarker = doAddCarMarker(pos)

  map.centerPos(pos, false)

  enableClickMarker()
}

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}

var markWithBleView = null
function showMarkWithBle(unit) {

  if (endMarker) {

    map.centerPos(endMarker.position, false)

    return
  }

  var name = map.regionEx.getFloorbyId(unit.floorId).name + '  ' + unit.name

  if (markWithBleView) {

    markWithBleView.name = name

    markWithBleView.show = true

    markWithBleView.unit = unit

    return
  }

  markWithBleView = new Vue({
    el:'#markwithble',
    data:function () {
      return {
        show:true,
        unit:unit,
        name:name
      }
    },
    components: { markwithble },
    methods: {
      onConfirm:function() {

        this.show = false

        addCarMarker(this.unit)
      },
      onClose:function() {

        this.show = false
      }
    }
  })
}

var findEmptySpaceInfo = {
  icon:config.publicPath + '/kongwei.png',
  title:'空位引导',
  type:'0',
  cb:navigateToEmptySpace
}

var findByBleInfo = {
  icon:config.publicPath + '/biaoji.png',
  title:'蓝牙标记',
  type:'1',
  cb:function() {
    markWithBluetooth()
  }
}

var findCarInfo = {
  icon:config.publicPath + '/zhaoche.png',
  title:'找车',
  type:'2',
  cb:function() {
    onFindCar()
  }
}

function showNormalBottomBar(bshow) {

  if (!normalBottomBar && bshow) {

    normalBottomBar = new NormalBottomBar([findEmptySpaceInfo, findByBleInfo, findCarInfo])
  }

  normalBottomBar && normalBottomBar.show(bshow)
}

function getRouters(path) {

  var results = []

  if (!path) {

    return results
  }

  for (var i = 0; i < path.paths.length; ++i) {

    var floorPath = path.paths[i]

    var name = map.regionEx.getFloorbyId(floorPath.floorId).name

    results.push({id:floorPath.floorId, name:name})
  }

  return results
}

function showNavigation() {
  
  _navigation = new Vue({
    el:'#navigation',
    components:{ navigation },
    data: function() {
      return {
        show:true,
        left:true,
        totaldistance:100,
        nextdistance:20
      }
    },
    methods: {
      onStopNavigate() {
  
        var unfind = {name:'未找到爱车', callback:function() {
      
            alertboxview.hide()
      
            map.stopRoute()
          }}
          
        var found = {name:'已找到爱车', callback:function() {
      
            alertboxview.hide()
      
            map.stopRoute()
          }}
  
        var cancel = {name:'取消', callback:() => {
      
            alertboxview.hide()
          }}
        
        showAlertBox('在中断导航前', '是否已找到您的爱车', [unfind, found, cancel])
      }
    }
  })
}

function showFindFacilityBtnView() {
  
  _findFacilityBtn = new Vue({
    el:'#publicfacility',
    components: { publicfacilitydiv },
    data() {
      return {
        show:true
      }
    },
    methods: {
      onclick() {
        
        showFindFacilityView()
      }
    },
  })
}

function doLocate() {
  
  map.doLocation(pos => {
    
    map.setCurrPos(pos)
    
    if (pos) {
      
      floorListView.locateFloorId = pos.floorId
    }
    else {
      
      floorListView.locateFloorId = null
    }
  }, res => {
    
    floorListView.locateFloorId = null
  
    errortipview.show(res)
  })
    .catch(res=>{
  
      errortipview.show('温馨提示：蓝牙未开启，请开启蓝牙')
    })
}

function showLocateStatusView() {

  locateStatusView = new Vue({
    el:'#locateState',
    components: { locatestatediv },
    methods: {
      doLocating() {

        if (map.getUserPos()) {

          this.dolocate = true

          map.centerPos(map.getUserPos(), false)

          map.autoChangeFloor = true
        }
        else {
  
          doLocate()
        }
      }
    },
    data: function() {
      return {
        show:true,
        dolocate:false
      }
    }
  })
}

function showFloorListView(bshow) {

  if (floorListView) {

    floorListView.show = bshow

    return
  }

  floorListView = new Vue({
    el:"#floorList",
    components: { floorlistdiv },
    data: function() {
      return {
        show:true,
        floorList:map.regionEx.floorList,
        currentFloorId:map.getFloorId(),
        locateFloorId:map.getUserPos() ? map.getUserPos().floorId : null
      }
    },
    methods:{
      onSelect(val) {
        
        this.currentFloorId = val
        
        map.changeFloor(val)
        
        map.autoChangeFloor = false
      }
    }
  })
}

function checkTargetValid(unitId, unitList) {

  for (var i = 0; i < unitList.length; ++i) {

    if (unitList[i].id === unitId) {

      return true
    }
  }

  return false
}

function checkNeedUpdateNaivtarget(unitlist) {

  if (!startEmptyNavi) {

    return
  }

  if (!targetUnit || !checkTargetValid(targetUnit.id, unitlist)) {

    targetUnit = map.findNearUnit(map.getUserPos(), unitlist)

    if (!map.doRoute(null, targetUnit.getPos(), true)) {

      var confirm = {name:'确定', callback:function() {

        alertboxview.hide()
      }}

      showAlertBox(null, '您附近有空位', [confirm])

      return
    }

    endMarker && map.removeMarker(endMarker)

    endMarker = addEndMarker(targetUnit.getPos())
  }
}

function getUnits(emptyspaces) {

  var emptyUnits = []

  for (var i = 0; i < emptyspaces.length; ++i) {

    var unit = new indoorun.idrUnit(emptyspaces[i])

    emptyUnits.push(unit)
  }

  return emptyUnits
}

function doFindEmptySpace() {

  var data = {regionId:map.getRegionId(), floorId:map.getFloorId()}

  var url = indoorun.idrNetworkInstance.host + 'chene/getSpaceUnitListOfRegion.html'

  indoorun.idrNetworkInstance.doAjax(url, data, function(res) {

    emptyUnits.length = 0

    for (var i = 0; i < res.data.length; ++i) {

      var units = getUnits(res.data[i].spaceUnitList)

      if (map.getFloorId() === res.data[i].floorId) {

        map.updateUnitsColor(units, 0x8aef99)
      }

      if (map.getUserPos() && map.getUserPos().floorId == res.data[i].floorId) {

        checkNeedUpdateNaivtarget(units)
      }

      units.forEach(unit => {

        emptyUnits.push(unit)
      })
    }

  }, function(res) {

    console.log(JSON.stringify(res))
  })
}

function showEmptySpaceView(bshow) {

  if (!bshow) {

    if (emptySpaceView) {

      emptySpaceView.show = false
    }

    return
  }

  if (emptySpaceView) {

    emptySpaceView.show = true
  }
  else {

    emptySpaceView = new Vue({
      el:'#emptyspace',
      components: { emptyspace },
      methods: {
        onFindEmptySpace:function() {

          this.doFind = !this.doFind

          if (this.doFind) {

            doFindEmptySpace()

            emptySpaceTimer = setInterval(doFindEmptySpace, 10000)
          }
          else {

            clearInterval(emptySpaceTimer)

            emptySpaceTimer = null

            map.clearFloorUnitsColor(true)

            emptyUnits.length = 0
          }
        }
      },
      data: function() {
        return {
          doFind:false,
          show:true
        }
      }
    })
  }
}

var gmtime = new Date().getTime()

map.initMap('yf1248331604', 'map', regionId)

function askSpaceUnitWhenChangeFloor() {

  if (!emptySpaceView || !emptySpaceView.show || !emptySpaceView.doFind) {

    return
  }

  doFindEmptySpace()
}

var startLocate = false
var firsttime = true

function doLocating() {

  map.doLocation(pos => {

    map.setCurrPos(pos)

    if (pos) {

      floorListView.locateFloorId = pos.floorId

      if (firsttime) {

        map.centerPos(pos, false)

        firsttime = false
      }
    }
    else {

      floorListView.locateFloorId = null
    }

  }, errorId => {

    floorListView.locateFloorId = null

    if (errorId === 0) {

      errortipview.show('温馨提示：蓝牙未开启，请开启蓝牙')
    }
  })
}

var carno = getQueryString('carno')
map.addEventListener(map.eventTypes.onFloorChangeSuccess, function(data) {

  askSpaceUnitWhenChangeFloor()

  floorListView.currentFloorId = data.floorId

  if (!startLocate) {

    doLocating()

    startLocate = true
  }
})

function onNaviStatusUpdate({validate, projDist, goalDist, serialDist, nextSug}) {
  
  if (!validate) {
    
    return
  }
  
  if (projDist >= 150) {
    
    map.reRoute()
    
    return
  }
  
  if (_navigation) {
    
    _navigation.totaldistance = Math.ceil(goalDist/10.0)
  
    _navigation.nextdistance = Math.ceil(serialDist/10.0)
    
    _navigation.left = YFM.Map.Navigate.NextSuggestion.LEFT == nextSug
  }
  
  if (map.checkReachTargetFloor() && goalDist < 150) {
    
    var confirm = {name:'知道了', callback:function() {
        
        alertboxview.hide()
        
        map.stopRoute()
      }}
    
    showAlertBox('您已到达目的地', null, [confirm])
  }
}

map.addEventListener(map.eventTypes.onNaviStatusUpdate, status => {
  
  onNaviStatusUpdate(status)
})

function checkExit() {

  var cancel = {name:'取消', callback:function() {

    alertboxview.hide()
  }}

  var confirm = {name:'结束', callback:function() {

    map.stopRoute()

    alertboxview.hide()
  }}

  showAlertBox('是否结束本次导航', null, [cancel, confirm])
}

function onRouterFinish() {
  
  _navigation.show = false
  
  _findCarBtn.show = true
  
  _findFacilityBtn.show = true
  
  map.removeMarker(endMarker)
  
  endMarker = null
  
  targetUnit = null
  
  if (startEmptyNavi) {
    
    startEmptyNavi = false
    
    clearInterval(emptySpaceTimer)
    
    emptySpaceTimer = null
    
    emptySpaceView.doFind = false
    
    map.clearFloorUnitsColor(true)
    
    emptyUnits.length = 0
  }
  
  map.setStatus(YFM.Map.STATUS_TOUCH)
}

map.addEventListener(map.eventTypes.onRouterFinish, () => {
  
  onRouterFinish()
})

function doAddCarMarker(pos) {

  var IDRCarMarker = indoorun.idrMapMarker.IDRCarMarker

  var endMarker = new IDRCarMarker(pos, config.publicPath + '/markericon/car.png')

  map.addMarker(endMarker)

  return endMarker
}

function addEndMarker(pos) {

  var IDREndMarker = indoorun.idrMapMarker.IDREndMarker

  var endMarker = new IDREndMarker(pos, config.publicPath + '/markericon/end.png')

  map.addMarker(endMarker)

  return endMarker
}

map.addEventListener(map.eventTypes.onRouterSuccess, function(data) {

  if (!endMarker) {

    endMarker = addEndMarker(data.end)
  }
  
  _findFacilityBtn.show = false

  _bottomBar.show = false

  showNavigation()

  map.changeFloor(data.start.floorId)

  map.birdLook()
  
  map.setStatus(YFM.Map.STATUS_NAVIGATE)
})

let _findCarBtn = null
function showFindCarBtn() {
  
  _findCarBtn = new Vue({
    el:'#findcarbtn',
    components: { FindCarBtn },
    data(){
      return {
        show:true
      }
    },
    methods:{
      handleFindCar(){
        
        showFindCarByNum()
      }
    }
  })
}

function onInitMapSuccess(regionEx) {
  
  showFloorListView(true)
  
  showFindCarBtn()
  
  showLocateStatusView()
  
  showFindFacilityBtnView()
  
  document.title = regionEx.name
  
  zoomView = new ZoomView(map)
  
  zoomView.show()
  
  map.changeFloor(regionEx.floorList[0].id)
}

map.addEventListener(map.eventTypes.onInitMapSuccess, regionEx => {

  onInitMapSuccess(regionEx)
})

var tempMarkers = []

function onFindTargetUnits(units) {

  tempMarkers.length = 0

  if (units.length == 0) {

    return
  }

  var pos = units[0].getPos()

  addCarMarker(units[0])

  map.doRoute(null, pos)
}

function onMarkUnitInMap() {

  showFindFacilityBtnView(false)
  
  _findCarBtn.show = false

  showBottomBar('取消选择')
  
  errortipview.show('点击地图车位框可实现车位标记')

  map.addOnceEvent(map.eventTypes.onUnitClick, unit => {

    var pos = unit.getPos()

    addCarMarker(unit)

    _bottomBar.show = false

    map.doRoute(null, pos)

    return true
  })
}

function onFindCar() {

  if (!endMarker) {

    showFindCarByNum()

    return
  }

  if (!map.getUserPos()) {

    errortipview.show('定位失败，无法寻车')

    return
  }

  if (map.doRoute(null, endMarker.position)) {

    map.removeMarker(endMarker)

    endMarker = addEndMarker(endMarker.position)
  }
}

map.addEventListener(map.eventTypes.onRouterFailed, function () {

  errortipview.show('您已在目的地附近')
})

var _carlist = [
  {
    carNo:'沪A 21548',
    placeCode:'F-352',
    unitId:"14980981315802601"
  },
  {
    carNo:'沪A 21548',
    placeCode:'F-351',
    unitId:"14980981315802601"
  },
  {
    carNo:'沪A 21548',
    placeCode:'F-356',
    unitId:"14980981315802601"
  },
  {
    carNo:'沪A 21548',
    placeCode:'F-355',
    unitId:"14980981315802601"
  },
  {
    carNo:'沪A 21548',
    placeCode:'F-354',
    unitId:"14980981315802601"
  },
  {
    carNo:'沪A 21888',
    placeCode:'F-343',
    unitId:"14980981315802601"
  }]

function onFindByCarNo(carNo) {

  const url = indoorun.idrNetworkInstance.host + 'chene/getParkingPlaceUnitByCarNo.html'

  var data = {
    'regionId': map.getRegionId(),
    'carNo': carNo,
  }

  indoorun.idrNetworkInstance.doAjax(url, data, function(res) {

    // alert(JSON.stringify(res))

    var carlist = res.data.matchedCarList

    if (!carlist || carlist.length <= 0) {

      return
    }

    if (carlist.length > 1) {

      _findCarByNum.carlist = carlist
    }
    else {

      var units = map.findUnitWithName(carlist[0].floorId, carlist[0].placeCode)

      addCarMarker(units[0])

      if (map.getUserPos()) {

        map.doRoute(null, units[0].getPos())
      }

      _findCarByNum.show = false
    }

  }, function() {

    _findCarByNum.error = true
  })
}

var _findCarByNum = null
function showFindCarByNum(carno) {

  if (_findCarByNum) {

    _findCarByNum.show = true

    _findCarByNum.carlist = null

    return
  }

  _findCarByNum = new Vue({
    el:'#findwithnum',
    components: { findwithnum },
    data:function () {
      return {
        show:true,
        error:false,
        carlist:null,
        carno:carno
      }
    },
    methods: {
      onFindByCarNo:function (carNum) {

        this.error = false

        onFindByCarNo(carNum)
      },
      onChangeToSearchUnit:function () {

        this.show = false

        showFindCarByUnit()
      },
      onSelectCar:function (car) {

        var unit = map.findUnitWithId(car.unitId)

        addCarMarker(unit)

        if (map.getUserPos()) {

          map.doRoute(null, unit.getPos())
        }

        this.show = false
      },
      onClose:function () {

        this.show = false
      }
    }
  })
}

var _findCarByUnit = null
function showFindCarByUnit() {

  if (_findCarByUnit) {

    _findCarByUnit.show = true

    return
  }

  _findCarByUnit = new Vue({
    el:'#findwithunit',
    components: { findwithunit },
    data:function () {
      return {
        show:true,
        map:map,
        showerrorincarno:false
      }
    },
    methods: {
      onFindUnits:function (unitName) {

        onFindTargetUnits(unitName)
      },
      onClose:function () {

        this.show = false
      },
      onMarkInMap:function () {

        onMarkUnitInMap()
      }
    }
  })
}

function navigateToEmptySpace() {

  if (map.getUserPos() == null) {

    errortipview.show('定位失败, 无法导航至空车位')

    return
  }

  startEmptyNavi = true

  doFindEmptySpace()

  if (!emptySpaceTimer) {

    emptySpaceTimer = setInterval(doFindEmptySpace, 10000)

    emptySpaceView.doFind = true
  }
}

function markWithBluetooth() {

  var pos = map.getUserPos()

  if (endMarker) {

    map.centerPos(endMarker.position, false)

    return
  }

  if (!pos) {

    errortipview.show('定位失败，无法标记')

    return
  }

  showMarkWithBle(map.getNearUnit(pos))
}

var findFacilityView = null

function showFindFacilityView() {

  if (!findFacilityView) {

    findFacilityView = new FindFacilityView(map)
  }

  findFacilityView.show()
}

function showAlertBox(title, message, buttons) {

  if (!alertboxview) {

    alertboxview = new AlertBox()
  }

  alertboxview.show(title, message, buttons)
}

var _bottomBar = null

function showBottomBar(message) {

  if (_bottomBar) {
  
    _bottomBar.show = true
  
    _bottomBar.message = message
    
    return
  }
  
  _bottomBar = new Vue({
    el:'#bottombar',
    components:{ bottombar },
    data: function() {
      return {
        message:message,
        show:true
      }
    },
    methods:{
      onClick() {
      
        this.show = false
        
        _findCarBtn.show = true
      }
    }
  })
}

function updateMarkerPos() {

  showBottomBar('取消选择')

  map.addOnceEvent(map.eventTypes.onUnitClick, function(unit) {

    endMarker = map.updateMarkerLocation(endMarker, unit.getPos())

    _bottomBar.show = false
    
    return true
  })
}

function deleteMarker() {

  map.removeMarker(endMarker)

  endMarker = null

  indoorun.idrNetworkInstance.removeMarkedUnit(regionId, null, null)
}

function sharePosition() {

  var ua = navigator.userAgent;

  if(ua.match(/iPhone|iPod/i) != null){

    setTimeout("javascript:location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.yellfun.yellfunchene'", 0);

  } else if (ua.match(/Android/i) != null){

    window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.yellfun.yellfunchene";
  }
}

function showUpdateMarkerView(show, marker) {

  if (!updateMarkerView && show) {

    updateMarkerView = new UpdateMarkerView(deleteMarker, updateMarkerPos, sharePosition)
  }

  updateMarkerView && updateMarkerView.show(show, marker, map)
}
