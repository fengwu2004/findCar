function getPathData(regionId) {
  
  var url = "https://wx.indoorun.com/wx/getRegionPathData?regionId=" + regionId
  
  get(url, {}, (data)=>{
    
    postMessage(data)
  
  }, (res)=>{
  
    console.log(res)
  })
}

function get(url, body, success, fail) {
  
  let request = new XMLHttpRequest()
  
  request.open('get', url)
  
  request.onreadystatechange = ()=>{
    
    if(request.readyState === 4) {
      
      if(request.status >= 200 && request.status < 300) {
        
        success.call(undefined, request.responseText)
        
      } else if (request.status >= 400) {
        
        fail.call(undefined, request)
      }
    }
  }
  
  request.send(body)
}

onmessage = function(event) {

  if (event.data.mapId != null) {
  
    getPathData(event.data.mapId)
  }
}

