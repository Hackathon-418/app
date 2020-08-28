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
                        <h2 class="enroll">新規会員登録</h2>
                        <div class="form-element-frame">
                            <span class="from-discription">メールアドレス</span>と
                            <span class="from-discription">パスワード</span>を入力してください。
                            <form @submit.prevent="registerUser">
                                <div class="form-element-padding">
                                    <div class="form-element">
                                        <span class="element-discription">メールアドレス</span>
                                        <input type="email" v-model="email" placeholder="chathub@example.com" class="element-box"/>
                                    </div>
                                    <div class="form-element">
                                        <span class="element-discription">パスワード</span>
                                        <input type="password" v-model="password" placeholder="password" class="element-box"/>
                                    </div>
                                    <div class="form-element">
                                        <span class="element-discription">表示名</span>
                                        <input type="text" v-model="name" placeholder="name" class="element-box"/>
                                    </div>
                                    <div v-if="errors.length">
                                        <ul class="form-element-frame">
                                            <li class="error-message">{{ errors }}</li>
                                        </ul>
                                    </div>
                                    <div class="submit-frame">
                                        <button type="submit" class="submit-btn">登録</button>
                                    </div>
                                    <span class="tologin"><router-link to="/signin">ログインはこちらから</router-link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer"></footer>
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
                name: "",
                errors: ""
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
                                email: user.email,
                                name: this.name
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
                            this.errors = "入力したメールアドレスは登録済みです。";
                        } else if (e.code == "auth/weak-password") {
                            this.errors = "入力したパスワードはセキュリティで危険です。";
                        } else {
                            this.errors = "入力したメールアドレスかパスワードに問題があります。";
                        }
                    });
            }
        }
    };
</script>

<style>
    /*全体のフレーム 2行目*/
    .frame{
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    /*ヘッダー 3行目*/
    .header{
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        align-items: center;
        border-bottom-width: 1px;
        background: linear-gradient(90deg, #00d9b4, #6ee887);
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

    /*メインフレーム ９行目*/
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
        width: 40%;
    }
    /*フォームのメインフレーム 12行目 */
    .form-main-frame{
        width: 100%;
        text-align: center;
    }

    /*登録文字 13行目*/
    .enroll{
        font-size: 2.25rem;
        font-weight: 700;
    }

    /*フォームの要素フレーム 14行目 28行目*/
    .form-element-frame{
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    /*フォームの説明 15，16行目*/
    .from-discription{
        font-weight: 600;
    }

    /*18行目 */
    .form-element-padding{
        padding-left: 3rem;
        padding-right: 3rem;
    }

    /*18行目 23行目 */
    .form-element{
        margin-bottom: 0.5rem;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }

    /*20行目 24行目 */
    .element-discription{
        float: left;
        --text-opacity: 1;
        color: #718096;
        color: rgba(113, 128, 150, var(--text-opacity));
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }

    /*21行目 25行目 */
    .element-box{
        font-size: 1.125rem;
        padding: 0.5rem;
        --bg-opacity: 1;
        background-color: #f7fafc;
        background-color: rgba(247, 250, 252, var(--bg-opacity));
        border-radius: 0.25rem;
        width:100%;
    }

    /*29行目 */
    .error-message{
        font-weight: 600;
        --text-opacity: 1;
        color: #c53030;
        color: rgba(197, 48, 48, var(--text-opacity));
    }

    /*32行目 */
    .submit-frame{
        height: 100%;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
    }

    /*33行目 */
    .submit-btn{
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
        width:100%
    }

    /*35行目 */
    .tologin{
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
        --text-opacity: 1;
        color: #dd6b20;
        color: rgba(221, 107, 32, var(--text-opacity));
        font-size: 1.125rem;
        font-weight: 600;
    }

    /*43行目 */
    .footer{
        display: flex;
        justify-content: space-between;
        padding: 1.5rem;
        border-bottom-width: 1px;
        align-items: center;
        background: linear-gradient(90deg, #6ee887 ,#00d9b4);
    }
</style>