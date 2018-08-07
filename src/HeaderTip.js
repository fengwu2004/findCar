import Vue from 'vue'
import HeaderTipControl from '@/components/HeaderErrorMsgControl.vue'

function HeaderTip() {
  
  var _vm = null
  
  var _message = ''
  
  function load() {
    
    _vm = new Vue({
      el:'#errortip',
      components: { HeaderTipControl },
      data() {
        return {
          message:_message,
          display:1
        }
      }
    })
  }
  
  function show(message) {
    
    _message = message
    
    if (!_vm) {
  
      load()
  
      setTimeout(()=> {
    
        _vm.display = 0
    
      }, 1000)
      
      return
    }
  
    _vm.display = 1
    
    _vm.message = message
  
    _vm.$el.style.visibility = 'visible'
    
    setTimeout(function() {
    
      _vm.display = 0
      
      setTimeout(function() {
  
        _vm.$el.style.visibility = 'hidden'
        
      }, 1000)
      
    }, 1000)
  }
  
  this.show = show
}

export { HeaderTip as default }
