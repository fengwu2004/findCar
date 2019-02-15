function doLocate(beacons) {

  locateServer.onReceiveBeacons(beacons)
}

function showCarPos() {

  if (window.MapVm) {
  
    window.MapVm.onShowCarPos()
  }
}

function setBlueToothOff() {
  
  if (window.MapVm) {
    
    return window.MapVm.updateBluetoothState(false)
  }
}

function setBlueToothOn() {
  
  if (window.MapVm) {
    
    return window.MapVm.updateBluetoothState(true)
  }
}

function showUserPos() {
  
  if (window.MapVm) {
    
    window.MapVm.doLocating()
  }
}
