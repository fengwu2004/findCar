import Vue from 'vue'
import floatalertview from '@/components/floatalertview.vue'

export class FloatAlert {
  
  constructor() {
  
    this.vm = null
    
    this.timeId = null
  }
  
  _load(msg) {
  
    this.vm = new Vue({
      el:'floatalertview',
      components: { floatalertview },
      data() {
        return {
          show:true,
          msg:msg
        }
      }
    })
  
  }
  
  show(msg) {
  
    if (!this.vm) {
      
      this._load(msg)
    }
    else {
      
      this.vm.show = true
      
      this.vm.msg = msg
    }
    
    clearTimeout(this.timeId)
  
    this.timeId = setTimeout(()=>{
    
      this.vm.show = false
      
    }, 1000)
  }
}
