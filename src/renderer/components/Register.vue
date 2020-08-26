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
                <div class="w-2/5 bg-white">
                    <div class="my-12 text-center">
                        <h2 class="text-4xl font-bold">新規会員登録</h2>
                        <div class="my-4">
                            <span class="font-semibold">メールアドレス</span>と
                            <span class="font-semibold">パスワード</span>を入力してください。
                            <form @submit.prevent="registerUser">
                                <div class="px-12">
                                    <div class="mb-2 py-1">
                                        <span class="float-left text-gray-600 py-1">メールアドレス</span>
                                        <input type="email" v-model="email" placeholder="chathub@example.com" class="text-lg h-full p-2 bg-gray-100 rounded" style="width:100%"/>
                                    </div>
                                    <div class="mb-2  py-1">
                                        <span class="float-left text-gray-600 py-1">パスワード</span>
                                        <input type="password" v-model="password" class="text-xl p-2 bg-gray-100 rounded" placeholder="password" style="width:100%"/>
                                    </div>
                                    <div v-if="errors.length">
                                        <ul class="my-4">
                                            <li v-for="(error, index) in errors" :key="index" class="font-semibold text-red-700">{{ error }}</li>
                                        </ul>
                                    </div>
                                    <div class="h-full my-6">
                                        <button type="submit" style="width:100%" class="text-xl bg-orange-400 text-white py-2 rounded">登録</button>
                                    </div>
                                    <span class="py-6 text-orange-600 text-lg font-semibold"><router-link to="/signin">ログインはこちらから</router-link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="flex justify-between p-6 border-b items-center" style="background: linear-gradient(90deg, #6ee887 ,#00d9b4)">
        </footer>
    </div>
</template>

<script>
    import firebase from "firebase/app";
    import "firebase/auth";
    import "firebase/database";

    export default {
        data() {
            return {
                email: "",
                password: "",
                errors: []
            };
        },
        methods: {
            registerUser() {
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.email, this.password)
                    .then(response => {
                        const user = response.user;
                        firebase
                            .database()
                            .ref("users")
                            .child(user.uid)
                            .set({
                                user_id: user.uid,
                                email: user.email
                            })
                            .then(() => {
                                this.$router.push("/");
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    })
                    .catch(e => {
                        console.log(e);
                        if (e.code == "auth/email-already-in-use") {
                            this.errors.push("入力したメールアドレスは登録済みです。");
                        } else if (e.code == "auth/weak-password") {
                            this.errors.push("入力したパスワードはセキュリティで危険です。");
                        } else {
                            this.errors.push("入力したメールアドレスかパスワードに問題があります。");
                        }
                    });
            }
        }
    };
</script>

<style>

    progress{
        width : 60%;
        background: crimson;
        color: lightblue;
    }

</style>