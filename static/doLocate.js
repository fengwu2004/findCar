
function doLocate(beacons) {

  locateServer.onReceiveBeacons(beacons)
}

function showCarPos() {

  if (window.MapVm) {
  
    window.MapVm.onShowCarPos()
  }
}
