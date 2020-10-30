import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import login from './components/login'
import home from './components/Home'

Vue.use(VueRouter)

export const router = new VueRouter({
    routes : [
        {path : '/', 
        component : login,
        },
        {
            path : '/home', 
            component : home, 
            beforeEnter(to,from,next){
                    if(store.getters.girisYapıldımı){
                        next()
                    }else{
                        next('/')
                    }
                }
        }
    ],
    mode : "history"
})