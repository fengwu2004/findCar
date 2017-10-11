// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import indoorun from '../../indoorunMap/map.js'
import FindCarView from './findcarview'

import FindFacilityBtnView from './findfacilityview'
import FindFacilityView from './findfacility'
import NormalBottomBar from './normalbottombar'
import NavigateBottomBar from './navigateBottomBar'
import AlertBox from './AlertBox'
import BottomBar from './bottombar'
import UpdateMarkerView from './updatemarkerview'
import ErrorTipView from './errortipview'
import ZoomView from './zoomview'

import floorlistdiv from './components/floorList.vue'
import markwithble from './components/markwithble.vue'
import emptyspace from './components/emptyspace.vue'
import locatestatediv from './components/locatestatus.vue'

var config = require('../config')

Vue.config.productionTip = false

var regionId = '14980981254061534'

var idrMapView = indoorun.idrMapView

var map = new idrMapView()

map.publicPath = config.publicPath

var floorListView = null

var emptySpaceView = null

var locateStatusView = null

var findFacilityBtnView = null

var navigateBottomBar = null

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

indoorun.idrDebug.showDebugInfo(true)

function onSavePackingUnit(unit) {

  var pos = unit.getPos()

  var url = '/saveCheLocation.html'

  var data = {
    unitId: unit.id,
    floorId: unit.floorId,
    regionId: map.getRegionId(),
    svgX: pos.x,
    svgY: pos.y
  }

  indoorun.idrNetworkInstance.saveMarkedUnit(unit, () => {

    console.log('保存成功')
  })
}

function enableClickMarker() {

  map.addEventListener(map.eventTypes.onMarkerClick, marker => {

    if (marker.id != endMarker.id || endMarker.className !== 'IDRCarMarker') {

      return
    }

    map.centerPos(marker.position, false)

    showUpdateMarkerView(true, marker)

    map.addOnceEvent(map.eventTypes.onMapScroll, () => {

      showUpdateMarkerView(false, null)
    })
  })
}

map.addEventListener(map.eventTypes.onMapScroll, () => {

  if (!locateStatusView) {

    return
  }

  locateStatusView.dolocate = false
})

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

        var pos = this.unit.getPos()

        onSavePackingUnit(this.unit)

        endMarker = addCarMarker(pos)

        map.centerPos(pos)

        enableClickMarker()
      },
      onClose:function() {

        this.show = false
      }
    }
  })
}

var findEmptySpaceInfo = {
  icon:config.publicPath + '/static/kongwei.png',
  title:'空位引导',
  type:'0',
  cb:navigateToEmptySpace
}

var findByBleInfo = {
  icon:config.publicPath + '/static/biaoji.png',
  title:'蓝牙标记',
  type:'1',
  cb:function() {
    markWithBluetooth()
  }
}

var findCarInfo = {
  icon:config.publicPath + '/static/zhaoche.png',
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

function showNavigateBottombar(bshow, path, cb) {

  if (!navigateBottomBar && bshow) {

    navigateBottomBar = new NavigateBottomBar(map)
  }

  navigateBottomBar && navigateBottomBar.show(bshow, path, cb)
}

function showFindFacilityBtnView(bshow, cb) {

  if (!findFacilityBtnView && bshow) {

    findFacilityBtnView = new FindFacilityBtnView(cb)
  }

  findFacilityBtnView && findFacilityBtnView.show(bshow)
}

function showLocateStatusView(bshow) {

  if (locateStatusView) {

    locateStatusView.show = bshow

    return
  }

  locateStatusView = new Vue({
    el:'#locateState',
    components: { locatestatediv },
    methods: {
      doLocating:function() {

        if (map.getUserPos()) {

          this.dolocate = true

          map.centerPos(map.getUserPos(), false)

          map.autoChangeFloor = true
        }
        else {

          map.doLocation(function(pos) {

            map.setCurrPos(pos)

            if (pos) {

              floorListView.locateFloorId = pos.floorId
            }
            else {

              floorListView.locateFloorId = null
            }
          }, function (errorId) {

            floorListView.locateFloorId = null

            if (errorId === 0) {

              errortipview.show('温馨提示：蓝牙未开启，请开启蓝牙')
            }
          })
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
      onSelect:function(val) {
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

var getSaveUnit = false

var startLocate = false
map.addEventListener(map.eventTypes.onFloorChangeSuccess, function(data) {

  askSpaceUnitWhenChangeFloor()

  floorListView.currentFloorId = data.floorId

  if (!getSaveUnit) {

    indoorun.idrNetworkInstance.getMarkedUnit(map.getRegionId(), function(res) {

      if (res.code === 'success') {

        endMarker = addCarMarker({x:res.data.svgX, y:res.data.svgY, floorId:res.data.floorId})

        enableClickMarker()
      }

    }, null)

    getSaveUnit = true
  }

  indoorun.idrDebug.showDebugInfo(true)

  indoorun.idrDebug.debugInfo('加载时间:' + (new Date().getTime() - gmtime).toString())

  if (!startLocate) {

    map.doLocation(function(pos) {

      map.setCurrPos(pos)

      if (pos) {

        floorListView.locateFloorId = pos.floorId
      }
      else {

        floorListView.locateFloorId = null
      }

      if (!startLocate) {

        map.centerPos(pos, false)
      }

      indoorun.idrDebug.debugInfo('定位成功')

    }, function(errorId) {

      floorListView.locateFloorId = null

      if (errorId === 0) {

        var confirm = {name:'确定', callback:function() {

          alertboxview.hide()
        }}

        showAlertBox(null, '手机蓝牙未开启,您可以尝试从手机设置中开启蓝牙设备', [confirm])
      }
      else {

        indoorun.idrDebug.debugInfo(JSON.stringify(errorId))
      }
    })

    startLocate = true
  }
})

map.addEventListener(map.eventTypes.onNaviStatusUpdate, function(status) {

  if (!status.validate) {

    return
  }

  if (status.goalDist < 150) {

    var cancel = {name:'取消', callback:function() {

      alertboxview.hide()
    }}

    var confirm = {name:'确定', callback:function() {

      alertboxview.hide()

      map.stopRoute()
    }}

    showAlertBox('您已到达目的地', '是否结束本次导航', [cancel, confirm])
  }
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

map.addEventListener(map.eventTypes.onRouterFinish, function() {

  showNavigateBottombar(false, null, null)

  showSomeUIInNavi(true)

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
})

function addCarMarker(pos) {

  var IDRCarMarker = indoorun.idrMapMarker.IDRCarMarker

  var endMarker = new IDRCarMarker(pos, config.publicPath + '/static/markericon/car.png')

  map.addMarker(endMarker)

  return endMarker
}

function addEndMarker(pos) {

  var IDREndMarker = indoorun.idrMapMarker.IDREndMarker

  var endMarker = new IDREndMarker(pos, config.publicPath + '/static/markericon/end.png')

  map.addMarker(endMarker)

  return endMarker
}

function showSomeUIInNavi(bshow) {

  showFloorListView(bshow)

  showEmptySpaceView(bshow)

  showNormalBottomBar(bshow)

  showFindFacilityBtnView(bshow, function() {

    showFindFacilityView()
  })
}

map.addEventListener(map.eventTypes.onRouterSuccess, function(data) {

  if (!endMarker) {

    endMarker = addEndMarker(data.end)
  }

  showSomeUIInNavi(false)

  showBottomBar(false)

  showNavigateBottombar(true, data.path, checkExit)

  map.changeFloor(data.start.floorId)

  map.birdLook()
})

map.addEventListener(map.eventTypes.onInitMapSuccess, function(regionEx) {

  showFloorListView(true)

  showEmptySpaceView(true)

  showLocateStatusView(true)

  showFindFacilityBtnView(true, function() {

    showFindFacilityView()
  })

  showNormalBottomBar(true)

  document.title = regionEx.name

  zoomView = new ZoomView(map)

  zoomView.show()

  map.changeFloor(regionEx.floorList[0].id)
})

var findcarview = null

var tempMarkers = []

function onFindTargetUnits(units) {

  tempMarkers.length = 0

  if (units.length == 1) {

    map.doRoute(null, units[0].getPos())

    return
  }

  showEmptySpaceView(false)

  showFindFacilityBtnView(false)

  showNormalBottomBar(false)

  for (var i = 0; i < units.length; ++i) {

    var IDRMapMarker = indoorun.idrMapMarker.IDRMapMarker

    var marker = new IDRMapMarker(units[i].getPos(), config.publicPath + '/static/markericon/temppoint.png')

    map.addMarker(marker)

    tempMarkers.push(marker)
  }

  map.addOnceEvent(indoorun.idrMapEvent.onMarkerClick, function(marker) {

    var pos = marker.position

    for (var i = 0; i < tempMarkers.length; ++i) {

      map.removeMarker(tempMarkers[i])
    }

    tempMarkers.length = 0

    map.doRoute(null, pos)
  })
}

function onMarkUnitInMap() {

  showEmptySpaceView(false)

  showFindFacilityBtnView(false)

  showNormalBottomBar(false)

  showBottomBar(true, '点击车位进行选择')

  map.addOnceEvent(map.eventTypes.onUnitClick, function (unit) {

    var pos = unit.getPos()

    indoorun.idrNetworkInstance.saveMarkedUnit(unit, map.getRegionId(), null, null)

    map.doRoute(null, pos)

    showBottomBar(false, '')
  })
}

function onFindCar() {

  if (map.getUserPos() == null) {

    errortipview.show('定位失败，无法找车')

    return
  }

  if (endMarker) {

    map.removeMarker(endMarker)

    endMarker = addEndMarker(endMarker.position)

    map.doRoute(null, endMarker.position)
  }
  else {

    showFindCarView()
  }
}

function onFindByCarNo(carNo) {

  const url = indoorun.idrNetworkInstance.host + 'chene/getParkingPlaceUnitByCarNo.html'

  var data = {
    'regionId': map.getRegionId(),
    'carNo': carNo,
    'floorId': map.getFloorId(),
  }

  indoorun.idrNetworkInstance.doAjax(url, data, function(res) {

    alert(JSON.stringify(res))

    var data = res.data

    var unit = new indoorun.idrUnit(data.parkingUnit)

    map.doRoute(null, unit.getPos())

  }, function() {

    findcarview.showErrorOfFindByCarNo()
  })
}

function showFindCarView() {

  if (!findcarview) {

    findcarview = new FindCarView(map, function(units) {

      onFindTargetUnits(units)

    }, function() {

      onMarkUnitInMap()

    }, onFindByCarNo)
  }

  findcarview.show(0)
}

function navigateToEmptySpace() {

  if (map.getUserPos() == null) {

    errortipview.show('定位失败, 无法导航至空车位')

    return
  }

  startEmptyNavi = true

  if (!emptySpaceTimer) {

    doFindEmptySpace()

    emptySpaceTimer = setInterval(doFindEmptySpace, 10000)

    emptySpaceView.doFind = true
  }
}

function markWithBluetooth() {

  var pos = map.getUserPos()

  if (endMarker) {

    map.centerPos(endMarker.position)

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

var bottomBar = null

function showBottomBar(bshow, message) {

  if (!bottomBar && bshow) {

    bottomBar = new BottomBar()
  }

  bottomBar && bottomBar.show(bshow, message)
}

function updateMarkerPos() {

  showBottomBar(true, '点击车位进行选择')

  showNormalBottomBar(false)

  map.addOnceEvent(map.eventTypes.onUnitClick, function(unit) {

    endMarker = map.updateMarkerLocation(endMarker, unit.getPos())

    showBottomBar(false, '')

    showNormalBottomBar(true)
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
