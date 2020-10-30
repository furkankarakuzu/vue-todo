import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {router} from './routes'
Vue.use(Vuex)

const store = new Vuex.Store({
    state : {
        token : "",
        list : [],
        listId : [],
        userId : "",
        loginError : true,
        registerError:true
    },
    mutations : {
        setToken(state,token){
            state.token = token
        },
        clearToken(state){
            state.token=""
        },
        updateList(state,upList){
            state.list = upList
        },
        updateListId(state, listId){
            state.listId=listId
        },
        setUserID(state,id){
            state.userId=id
        },
        clearUserID(state){
            state.userId=""
            state.list=""
        },
        loginError(state,info){
            state.loginError=info
            setTimeout(() => {
                state.loginError=!info
            }, 3000);
        },
        registerError(state,info){
            state.registerError=info
            setTimeout(() => {
                state.registerError=!info
            }, 3000);
        }
    },
    actions : {
        initAuth({commit}){
            let token = localStorage.getItem("token")
            if(token){
                commit("setToken",token)
                router.push("/home")
            }else{
                router.push("/")
            }

            let _userID=localStorage.getItem("userID")
            if(_userID){
                commit("setUserID",_userID)
            }
        },
        login({commit},veri){
            axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD49Ypxn3OkIJeAiekuMAZCqJdtrQxIvOA',
            veri
            ).then(response=>{
                commit("setToken",response.data.idToken)
                commit("setUserID",response.data.localId)
                router.push("/home")
                localStorage.setItem("token", response.data.idToken)
                localStorage.setItem("userID", response.data.localId)
            }).catch(e=>{
                console.log(e)
                commit("loginError",false)
            })
        },
        kayit({commit},data){
            axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD49Ypxn3OkIJeAiekuMAZCqJdtrQxIvOA',
                data
            ).then(response=>{
                commit("setToken",response.data.idToken)
                commit("setUserID",response.data.localId)
                localStorage.setItem("token", response.data.idToken)
                localStorage.setItem("userID", response.data.localId)
                router.push("/home")
            }).catch(e=>{
                console.log(e)
                commit("registerError",false)
            })
        },
        logout({commit}){
            commit("clearToken")
            commit("clearUserID")
            router.push("/")
            localStorage.removeItem("token")
            localStorage.removeItem("userID")
        },
        async saveList({commit},list){
            console.log("saveList Commit "+commit)
            await axios.post("https://todo-10e4f.firebaseio.com/list.json",list)
        },
        async getList({commit},userId){
            await axios.get("https://todo-10e4f.firebaseio.com/list.json")
            .then(response=>{
                let arr=[]
                let arrId=[]
                for (let data in response.data) {
                    if(response.data[data].userId==userId){
                        arr.push(response.data[data])
                        arrId.push(data)
                    }
                }
                commit("updateListId",arrId)
                commit("updateList",arr)
            })
        },
        async deleteList({commit,},listIdIndex){
            let key = this.getters.getListId[listIdIndex]
            
            await axios.delete("https://todo-10e4f.firebaseio.com/list/"+key+".json")
            .then(response=>{
                console.log(response)
            })
            this.dispatch("getList",this.state.userId)
            console.log(commit)
        },
        async hepsiniSil(){
            let keys = this.getters.getListId
            for (let i = 0; i < keys.length; i++) {
                await axios.delete("https://todo-10e4f.firebaseio.com/list/"+keys[i]+".json")
                .then(response=>{
                    console.log(response)
                })
                this.dispatch("getList",this.state.userId)
            }
        }
    },
    getters : {
        girisYapıldımı(state){
            return state.token !==""
        },
        getListId(state){
            return state.listId
        }
    }
})

export default store