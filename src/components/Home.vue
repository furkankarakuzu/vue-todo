<template>
<div>
    <!-- NAVBAR START -->
    <nav>
      <v-toolbar flat app>
          <v-toolbar-title class="text-uppercase grey--text">
            <span class="font-weight-light">Todo</span>
            <span> App</span>
          </v-toolbar-title>

          <v-spacer></v-spacer>
          
          <v-btn text color="grey" @click="cikis">
            <span>Sign out</span>
            <v-icon right>mdi-login</v-icon>
          </v-btn>

        </v-toolbar>  
    </nav>
    <!-- NAVBAR END -->
    
    <!-- ----------------------------------------------------- --> 

    <!-- HOME START -->
    <v-main style="max-width:600px; min-width:300px; margin-left:auto; margin-right:auto;">
      <v-container>
        <div style="margin-left:9%">
          <v-row>
            <v-col cols="6" sm="9" md="8" style="margin-top:5px">
              <v-text-field placeholder="Ne yapacaksın?" solo v-model="item" @keypress.enter="ekle"></v-text-field>
              <span style="color:red" v-if="check">Lütfen boş alan bırakma</span>
            </v-col>
            <v-col cols="6" sm="3" md="4">
              <v-select
                :items="selectItems"
                label="Önem Derecesi"
                v-model="onem"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="6" sm="3" md="4" style="margin-top:-50px; margin-left:auto; margin-right:auto">
              <v-btn class="ma-2" color="success" @click="ekle">
                Listeye Ekle
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12" md="12" sm="12" style="text-align:center">
              <p style="font-size:1em; font-weight:bold; margin-bottom:auto">{{getList.length}} adet yapılacak işin var</p>
          </v-col>
        </v-row>


        <draggable
        :disabled="false"
        class="list-group"
        style="cursor : move"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <v-row v-for="items in getList" :key="items.id" class="items"  :class="items.onemClass"> 
          <v-col  cols="6" md="6" sm="6" class="item">
            {{items.title}} 
          </v-col>
          <v-col cols="4" md="4" sm="4" style="margin-top:auto; margin-bottom:auto;">
            <span style="color:black; opacity: .7; float:right; font-size:10px; font-weight:bold">Eklendiği Tarih : {{items.tarih}} </span> 
          </v-col>
          <v-col cols="2" md="2" sm="2" style="margin-top:auto; margin-bottom:auto;">
            <span class="icon" @click="sil(items)"> <v-icon>mdi-cancel</v-icon> </span>
          </v-col>
        </v-row>
      </draggable>


        <v-btn color="error" v-if="getList.length>0" style="margin-top:50px" block @click="dialog=true"> Hepsini Sil </v-btn>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">
              Silmek istediğine emin misin?
            </v-card-title>
            <v-card-text>Bütün yapılacaklar listesini silmek istediğine emin misin? Bu işlem geri alınamaz..</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-1"
                text
                @click="dialog = false"
              >
                Reddet
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                @click="hepsiniSil"
              >
                Sil
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
    <!-- HOME END -->
</div>
</template>

<script>
import store from '../store'
import draggable from 'vuedraggable'
export default {
    components : {
      draggable
    },
    data(){
      return{
        selectItems : ['Hallederiz ya', 'Halletsem iyi olur', 'Acil halletmem lazım'],
        check:false,
        item : "",
        onem:"",
        onemClass:"",
        date : "",
        dragging: false,
        dialog:false,
      }
    },
    methods : {
      checkMove: function(e) {
        window.console.log("Future index: " + e.draggedContext.futureIndex);
      },
      async ekle(){
        if(this.item.trim()=="" || this.onem=="")
        {
          this.check=true
        }else{
          this.check=false
          
          if(this.onem=="Hallederiz ya"){
            this.onemClass='hallederiz'
          }else if(this.onem=="Halletsem iyi olur"){
            this.onemClass='halledicem'
          }else{
            this.onemClass='hallediyorum'
          }
          let tarih = new Date()
          let tarihh = tarih.getDate()+"/"+tarih.getMonth()+"/"+tarih.getFullYear()+" "+tarih.getHours()+":"+tarih.getMinutes()+":"+tarih.getSeconds()        
         await this.$store.dispatch("saveList", {userId : store.state.userId, tarih:tarihh, title : this.item, onemClass : this.onemClass})
          this.item=""
          this.onem=""
          await this.$store.dispatch("getList", store.state.userId)
        }
      },
      sil(e){
        let list = store.state.list
        let listIndex = list.indexOf(e)
        this.$store.dispatch("deleteList",listIndex)
      },
      cikis(){
        this.$store.dispatch("logout")
      },
      hepsiniSil(){
        this.dialog=false
        this.$store.dispatch("hepsiniSil")
      }
    },
    computed: {
      getList(){
        return store.state.list
      },
      getListId(){
        return store.state.listId
      },
      getDate(){
        let tarih = new Date()
        let tarihh = tarih.getDate()+"/"+tarih.getMonth()+"/"+tarih.getFullYear()+" "+tarih.getHours()+":"+tarih.getMinutes()+":"+tarih.getSeconds()
        return tarihh
      }
    },
    async created(){
      await this.$store.dispatch("getList", store.state.userId)
    }
  }
</script>

<style>
.items{
  margin-bottom: 10px;
  outline: 1px solid rgb(168, 163, 163) ;
}
.item{
  float:left;
  margin-top: auto;
  margin-bottom: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 600;
}
.icon{
  float: right;
  margin-right: 15px;
  padding: 5px;
  padding-bottom: 8px;
  opacity: 60%;
}
.icon:hover{
  cursor:pointer;
  border-radius: 50%;
  opacity: 100%;
}
.hallederiz{
  background-color: lightgreen;
}
.halledicem{
  background-color: lightyellow;
}
.hallediyorum{
  background-color: red;
}
</style>
