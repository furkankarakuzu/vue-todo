<template>
<div style="max-width:600px; min-width:360px; margin:auto;">
    <p v-if="!loginError" style="color:red">Kullanıcı adı veya şifre hatalı</p>
    <p v-if="!registerError" style="color:red">Kayıt esnasında bir hata oluştu</p>
    <v-tabs v-model="tab" show-arrows background-color="deep-purple accent-4" icons-and-text dark grow>
        <v-tabs-slider color="purple darken-4"></v-tabs-slider>
        <v-tab v-for="i in tabs" :key="i.id">
            <v-icon large>{{ i.icon }}</v-icon>
            <div class="caption py-1">{{ i.name }}</div>
        </v-tab>
        <v-tab-item>
            <v-card class="px-4">
                <v-card-text>
                    <v-form ref="loginForm" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="loginEmail" :rules="loginEmailRules" label="E-mail" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="loginPassword" required :append-icon="show1?'eye':'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Şifre" hint="En az 8 karakter" counter @click:append="show1 = !show1"></v-text-field>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6" xsm="12">
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                <v-btn x-large block :disabled="(loginEmail=='' || loginPassword=='') || !valid" color="success" @click="giris"> Giriş Yap </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-tab-item>
        <v-tab-item>
            <v-card class="px-4">
                <v-card-text>
                    <v-form ref="registerForm" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Şifre" hint="En az 8 karakter" counter @click:append="show1 = !show1"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Şifre Tekrarı" counter @click:append="show1 = !show1"></v-text-field>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                <v-btn x-large block :disabled="(email=='' || password=='' || verify=='') || !valid" color="success" @click="kayit">Kayıt Ol</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs>
</div>
</template>

<script>
export default {
computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Şifreler birbiriyle eşleşmeli";
    },
    loginError(){
        return this.$store.state.loginError
    },
    registerError(){
        return this.$store.state.registerError
    }
  },
  methods: {
    giris() {
        this.$store.dispatch("login", {email : this.loginEmail, password : this.loginPassword, returnSecureToken : true})
        this.loginEmail=""
        this.loginPassword=""
    },
    kayit(){
        this.$store.dispatch("kayit",{email : this.email, password: this.password, returnSecureToken : true})
        this.email=""
        this.password=""
        this.verify=""
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  },
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
        {id:1,name:"Giriş", icon:"mdi-account"},
        {id:2,name:"Kayıt Ol", icon:"mdi-account-outline"}
    ],
    valid: true,
    errorCheck : false,
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      v => !!v || "Zorunlu",
      v => /.+@.+\..+/.test(v) || "Gerçek bir mail girmeniz gerekiyor.."
    ],
    emailRules: [
      v => !!v || "Zorunlu",
      v => /.+@.+\..+/.test(v) || "Gerçek bir mail girmeniz gerekiyor.."
    ],

    show1: false,
    rules: {
      required: value => !!value || "Zorunlu",
      min: v => (v && v.length >= 8) || "Min 8 karakter"
    }
  })
}
</script>

<style>

</style>