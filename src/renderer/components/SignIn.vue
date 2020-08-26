<template>
    <div class="flex flex-col h-screen">
        <header class="flex justify-between p-4 border-b items-center" style="background: linear-gradient(90deg, #00d9b4, #6ee887)">
            <div class="flex">
                <img src="../assets/logogo.png" class="h-16 pl-10 " style="filter : drop-shadow(1px 2px 0px #888)">
                <h1 class="font-semibold text-white leading-tight mt-2 pl-4 text-3xl" style="text-shadow:1px 2px 0 #888">Chat Hub</h1>
            </div>
        </header>
        <div class="bg-white flex-auto">
            <div class="flex justify-center mt-16">
                <div class="w-4/5">
                    <div class="my-12">
                        <h2 class="text-2xl text-center font-bold pb-6">ログイン</h2>
                        <div class="flex justify-center">
                            <div class="pr-6">
                                <div style="border-left: solid 7px #FFB800" class="my-4">
                                    <span class="ml-3 font-semibold">ユーザー登録がお済みで無い方</span>
                                </div>
                                <div class="h-full pt-4">
                                    <button type="submit" style="width:100%" class="text-xl bg-orange-400 text-white py-2 rounded">
                                        <router-link to="/register">新規登録へ進む</router-link>
                                    </button>
                                </div>
                            </div>
                            <div class="pl-6">
                                <div class="my-4">
                                    <div style="border-left: solid 7px #B9E45E" class="my-4">
                                        <span class="font-semibold ml-3">ユーザー登録がお済みの方</span>
                                    </div>
                                    <form @submit.prevent="signIn">
                                        <div class="mb-2 py-1">
                                            <span class="float-left text-gray-600 py-1">メールアドレス</span>
                                            <input type="email" v-model="email" placeholder="chathub@example.com" class="text-lg h-full p-2 bg-gray-100 rounded" style="width:100%"/>
                                        </div>
                                        <div class="mb-2  py-1">
                                            <label class="float-left text-gray-600 py-1">パスワード</label>
                                            <input type="password" v-model="password" class="text-xl p-2 bg-gray-100 rounded" placeholder="password" style="width:100%"/>
                                        </div>
                                        <div v-if="errors.length">
                                            <ul class="my-4">
                                                <!--<li v-for="(error, index) in errors" :key="index" class="font-semibold text-red-700">{{ error }}</li>-->
                                                <li class="font-semibold text-red-700">{{ errors }}</li>
                                            </ul>
                                        </div>
                                        <div class="h-full">
                                            <button type="submit" style="width:100%" class="text-xl bg-orange-400 text-white py-2 rounded">サインイン</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer></footer>
    </div>
</template>

<style lang="scss">

    footer{
        display: block;
        width: 100%;
        height: 10px;
        background: linear-gradient(90deg, #6ee887 ,#00d9b4);
    }
</style>

<script>
    import firebase from "firebase/app";
    import "firebase/auth";

    export default {
        data() {
            return {
                email: "",
                password: "",
                //errors: []
                errors: ""
            };
        },
        methods: {
            signIn() {
                firebase
                    .auth()
                    .signInWithEmailAndPassword(this.email, this.password)
                    .then(response => {
                        console.log(response);
                        this.$router.push("/");
                    })
                    .catch(() => {
                        this.password = "";
                        //this.errors.push("メールアドレスかパスワードに誤りがあります。");
                        this.errors="メールアドレスかパスワードに誤りがあります。";
                    });
            }
        }
    }
</script>