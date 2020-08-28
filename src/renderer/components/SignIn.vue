<template>
    <div class="frame">
        <header class="header">
            <div class="header-frame">
                <img class="logo" src="../assets/logogo.png">
                <h1 class="app-name">Chat Hub</h1>
            </div>
        </header>
        <div class="main-frame">
            <div class="element-frame">
                <div class="form-frame">
                    <div class="form-main-frame">
                        <h2 class="login">ログイン</h2>
                        <div class="form-element-frame">
                            <div class="col-element">
                                <div class="element-titel-enroll">
                                    <span class="discription">ユーザー登録がお済みで無い方</span>
                                </div>
                                <div class="enroll-element">
                                    <router-link to="/register">
                                        <button type="submit" class="enroll-btn">新規登録へ進む</button>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-element">
                                <div class="login-frame">
                                    <div class="element-titel-login">
                                        <span class="discription">ユーザー登録がお済みの方</span>
                                    </div>
                                    <form @submit.prevent="signIn">
                                        <div class="col-element-frame">
                                            <span class="form-text-setting">メールアドレス</span>
                                            <input type="email" v-model="email" placeholder="chathub@example.com" class="input-box"/>
                                        </div>
                                        <div class="col-element-frame">
                                            <span class="form-text-setting">パスワード</span>
                                            <input type="password" v-model="password" placeholder="password" class="input-box"/>
                                        </div>
                                        <div v-if="errors.length">
                                            <ul class="login-frame">
                                                <!--<li v-for="(error, index) in errors" :key="index" class="font-semibold text-red-700">{{ error }}</li>-->
                                                <li class="error-text">{{ errors }}</li>
                                            </ul>
                                        </div>
                                        <div class="btn-frame">
                                            <button type="submit" class="submit-btn">サインイン</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer">
        </footer>
    </div>
</template>

<script>
    import firebase from "firebase/app";
    import "firebase/auth";
    import "firebase/storage";
    import "firebase/database";

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

<style>
    /*2行目 */
    .frame{
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    /*3行目 */
    .header{
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        border-bottom-width: 1px;
        align-items: center;
        background: linear-gradient(90deg, #00d9b4, #6ee887)
    }

    /*ヘッダー内div 4行目 */
    .header-frame{
        display: flex;
    }

    /*ロゴイメージ ５行目*/
    .logo{
        height: 4rem;
        padding-left: 2.5rem;
        filter : drop-shadow(1px 2px 0px #888);
    }

    /*ヘッダー内 文字6行目*/
    .app-name{
        font-weight: 600;
        --text-opacity: 1;
        color: #fff;
        color: rgba(255, 255, 255, var(--text-opacity));
        line-height: 1.25;
        margin-top: 0.5rem;
        padding-left: 1rem;
        font-size: 1.875rem;
        text-shadow:1px 2px 0 #888;
    }

    /*9行目 */
    .main-frame{
        --bg-opacity: 1;
        background-color: #fff;
        background-color: rgba(255, 255, 255, var(--bg-opacity));
        flex: 1 1 auto;
    }

    /*ボックス 10行目*/
    .element-frame{
        display: flex;
        justify-content: center;
        margin-top: 4rem;
    }

    /*フォームフレーム 11行目*/
    .form-frame{
        width: 80%;
    }
    /*フォームのメインフレーム 12行目 */
    .form-main-frame{
        margin-top: 3rem;
        margin-bottom: 3rem;
    }

    /*ログイン文字 13行目*/
    .login{
        font-size: 1.5rem;
        text-align: center;
        font-weight: 700;
        padding-bottom: 1.5rem;
    }

    /*14行目 */
    .form-element-frame{
        display: flex;
        justify-content: center;
    }

    /*15行目 25行目 */
    .col-element{
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }

    /*16行目  */
    .element-titel-enroll{
        border-left: solid 7px #FFB800;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    /*17行目  28行目*/

    .discription{
        margin-left: 0.75rem;
        font-weight: 600;
    }

    /*19行目 */
    .enroll-element{
        height: 100%;
        padding-top: 1rem;
    }

    /*21行目 */
    .enroll-btn{
        width:100%;
        font-size: 1.25rem;
        --bg-opacity: 1;
        background-color: #f6ad55;
        background-color: rgba(246, 173, 85, var(--bg-opacity));
        --text-opacity: 1;
        color: #fff;
        color: rgba(255, 255, 255, var(--text-opacity));
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        border-radius: 0.25rem;
    }

    /*26行目 */
    .login-frame{
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    /*27行目 */
    .element-titel-login{
        border-left: solid 7px #B9E45E;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    /*31行目 35行目 */
    .col-element-frame{
        margin-bottom: 0.5rem;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }

    /*32行目 36行目 */
    .form-text-setting{
        float: left;
        --text-opacity: 1;
        color: #718096;
        color: rgba(113, 128, 150, var(--text-opacity));
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }
    /*33行目 37行目 */
    .input-box{
        font-size: 1.125rem;
        padding: 0.5rem;
        --bg-opacity: 1;
        background-color: #f7fafc;
        background-color: rgba(247, 250, 252, var(--bg-opacity));
        border-radius: 0.25rem;
        width:100%;
    }

    /*42行目 */
    .error-text{
        font-weight: 600;
        --text-opacity: 1;
        color: #c53030;
        color: rgba(197, 48, 48, var(--text-opacity));
    }

    /*45行目 */
    .btn-frame{
        height: 100%;
    }

    /*46行目 */
    .submit-btn{
        width:100%;
        font-size: 1.25rem;
        --bg-opacity: 1;
        background-color: #f6ad55;
        background-color: rgba(246, 173, 85, var(--bg-opacity));
        --text-opacity: 1;
        color: #fff;
        color: rgba(255, 255, 255, var(--text-opacity));
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        border-radius: 0.25rem;
    }

    /*56行目 */
    .footer{
        display: flex;
        justify-content: space-between;
        padding: 1.5rem;
        border-bottom-width: 1px;
        align-items: center;
        background: linear-gradient(90deg, #6ee887 ,#00d9b4)
    }
</style>