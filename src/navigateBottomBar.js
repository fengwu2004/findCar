import Vue from 'vue'
import navigatebottombar from './components/navigateBottombar.vue'

function Navigatebottombar(map) {

  var _vm = null

  var _map = map

  var _cb = null

  function getRouters(path) {

    var results = []

    for (var i = 0; i < path.paths.length; ++i) {

      var floorPath = path.paths[i]

      var name = _map.regionEx.getFloorbyId(floorPath.floorId).name

      results.push({id:floorPath.floorId, name:name})
    }

    return results
  }

  function load(path) {

    var routers = getRouters(path)

    _vm = new Vue({
      el:'#navigate',
      components:{ navigatebottombar },
      data: function() {
        return {
          routerpos:routers,
          show:true
        }
      },
      methods: {
        onStopNavigate:function() {

          _cb && _cb()
        },
        onShowSelectFloor:function(value) {

          _map.changeFloor(value)

          _map.birdLook()
        }
      }
    })
  }

  function show(bShow, path, cb) {

    _cb = cb

    if (!_vm) {

      if (!bShow) {

        return
      }

      load(path)

      return
    }

    _vm.show = bShow
  }

  this.show = show
}

export { Navigatebottombar as default }
