<template>
    <div id="index">
        <!-- navigation -->
        <nav>
            <div id="logo_area">
                <img src="../assets/logo.png">
                <h1>Panvic</h1>
            </div>
            <div id="user_info">
                <Avator :user="user.icon" />
                <span class="online_status"></span>
                <div>
                    <p>{{ loginUser.name }}</p>
                    <button @click="signOut">サインアウト</button>
                </div>
            </div>
            <div class="section_title">
                <h2>プロジェクト</h2>
                <PlusCircle @click.native="showChannelModal" />
                <div
                        id="addproject_window"
                        style="background-color:rgba(0,0,0,0.5)"
                        v-show="channelModal"
                        @click="closeChannelModal"
                >
                    <div id="addproject_area" v-on:click.stop>
                        <h2>プロジェクトを追加する</h2>
                        <span class="x_button" @click="closeChannelModal">×</span>
                        <p>プロジェクトを追加して新しい開発を進めましょう！</p>
                        <input type="text" v-model="channel" placeholder="リモートリポジトリURL">
                        <button @click="addChannel">作成</button>
                    </div>
                </div>
            </div>
            <div
                    @click="channelMessage(channel)"
                    class="navigation_content"
                    v-for="channel in channels"
                    :key="channel.id"
            >{{ channel.channel_name }}</div>
            <div class="section_title">
                <h2>メンバー</h2>
            </div>
            <div class="navigation_content" v-for="user in users" :key="user.user_id">
                <span :class="[isOnline(user) ? 'online_status' : 'offline_status']"></span>
                <span class="" @click="directMessage(user)">{{ user.name }}</span>
            </div>
        </nav>

        <!-- chat -->
        <div id="channel_area">
            <header>
                <div id="channel_description">
                    <h2>{{ channel_name }}</h2>
                    <p v-if="targetRepository">{{ channel_description }}</p>
                </div>
                <div id="channel_button" v-if="targetRepository">
                    <div v-if="directoryExistence">
                        <button v-if="localRipository.older" @click="gitPull" style="background: #ff4f4c">アップデート</button>
                        <button v-else style="background: #919191;cursor: default;">アップデート</button>
                        <button v-if="directoryExistence" @click="openExplorer">フォルダを開く</button>
                    </div>
                    <button v-else @click="gitClone">ダウンロード</button>
                </div>
            </header>

            <main style="height: 95%;"
                  class="overflow-y-scroll relative border-t"
                  @dragleave="dragLeave"
                  @dragenter="dragEnter"
                  @drop.prevent="dropFile"
                  @dragover.prevent
            >
                <div
                        class="h-full z-10 absolute w-full flex justify-center items-center"
                        v-show="file.uplod_overlay"
                        style="pointer-events: none"
                >
                    <p class="font-bold text-4xl">ファイルを送信する</p>
                </div>
                <div
                        class="z-10 fixed top-0 left-0 h-full w-full flex items-center justify-center"
                        style="background-color:rgba(0,0,0,0.5)"
                        v-show="file.upload_modal"
                        @click="closefileUploadModal"
                >
                    <div class="z-20 bg-white text-gray-900 w-1/3 rounded-md" @click.stop>
                        <div class="w-full h-2">
                            <div class="bg-green-900 h-full block" style="width:0%" ref="progress_bar"></div>
                        </div>
                        <div class="flex flex-col p-6">
                            <div class="flex justify-between items-center">
                                <h2 class="text-3xl font-black leading-loose">ファイルをアップロードする</h2>
                                <span class="text-4xl" @click="closefileUploadModal">×</span>
                            </div>
                            <div class="my-3">
                <textarea
                        class="w-full rounded border-gray-900 border-solid border p-3"
                        placeholder="ファイルに関するメッセージを追加する"
                        v-model="file.message"
                />
                            </div>
                            <div class="bg-gray-200 p-3 border border-gray-400 rounded mb-4">
                                <div class="bg-white p-3">
                                    <span class="font-bold text-xl" v-text="file.name"></span>
                                </div>
                            </div>
                            <div class="flex justify-end items-center">
                                <button
                                        class="px-8 py-2 rounded bg-green-900 font-bold text-white"
                                        @click="fileUpload"
                                >アップロード</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-full flex flex-col ml-6">
                    <div id="message_bottom">
                        <div id="message_wrapper">
                            <div
                                    class="message_content"
                                    v-for="message in messages"
                                    :key="message.key"
                                    v-if="messageFilter(message)"
                            >
                                <Avator :user="userObj[message.user].icon" />
                                <div>
                                    <div class="message_user">{{ userObj[message.user].name }} <span>{{ convertTime(message.createdAt) }}</span></div>
                                    <div class="message_content">{{ message.content }}</div>
                                    <div v-if="message.category === 'message'" class="message_category message">#message</div>
                                    <div v-if="message.category === 'upload'"
                                         class="message_category upload"
                                         @click="openCommit(message.commitID)">
                                        #upload
                                    </div>
                                    <div v-if="message.url">
                                        <img src="https://image.flaticon.com/icons/png/512/129/129492.png" width="64px" height="64px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="send_message">
                        <span id="sendProgress" v-bind:style="{ width: progressWidth + '%' }"></span>
                        <textarea
                                :placeholder="placeholder"
                                v-model="message"
                        ></textarea>
                        <div id="button_area">
                            <button @click="sendMessage" style="background: $main-color">送信</button
                            ><span v-if="directoryExistence">
                                <button v-if="uploadAble" @click="gitPush" style="background: #ff4f4c">アップロード</button>
                                <button v-else style="background: #919191">アップロード</button>
                            </span>
                            <span class="filter_area">
                                <input type="text" v-model="messagefilter.target" placeholder="絞り込み検索"
                                ><button class="filter_reset" @click="messagefilter.target = null" v-if="messagefilter.target">x</button>
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style lang="scss">
    $main-color: #222222;
    @font-face {
        font-family: 'JapaneseFont';
        src: url('~@/assets/font/KosugiMaru-Regular.ttf') format('truetype');
    }
    
    #index{
        display: flex;
        font-family: 'JapaneseFont';
        user-select: none;
    }
    nav{
        display: inline-block;
        min-width: 240px;
        height: 100vh;
        background: $main-color;
        vertical-align: top;
        color: #FFFFFF;
        #logo_area{
            margin: 20px 0 0;
            cursor: default;
            img{
                display: inline-block;
                width: 40px;
                height: 40px;
                vertical-align: middle;
            }
            h1{
                display: inline-block;
                font-size: 1.5em;
                vertical-align: middle;
            }
        }
        #user_info{
            margin: 20px 0;
            display: flex;
            img{
                width: 50px;
                height: 50px;
                border-radius: 50px;
                vertical-align: middle;
            }
            .online_status{
                vertical-align: bottom;
                margin-left: -10px;
            }
            div{
                vertical-align: middle;
                height: 50px;
                p{
                    display: block;
                    line-height: 25px;
                    height: 25px;
                    padding-left: 10px;
                }
                button{
                    margin: 4px 0 0 10px;
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 0 20px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 0.7em;
                    color: $main-color;
                    font-weight: bold;
                    &:hover{
                        opacity: .8;
                    }
                }
            }
        }
        #addproject_window{
            position: fixed;
            z-index: 100;
            background: rgba(0,0,0,.4);
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            #addproject_area{
                color: #000000;
                background: #FFFFFF;
                border-radius: 10px;
                width: 390px;
                height: 60vh;
                padding: 5vh 10px;
                margin: 15vh auto 0;
                h2{
                    display: inline-block;
                    font-weight: bold;
                    font-size: 1.6em;
                    width: 90%;
                }
                .x_button{
                    display: inline-block;
                    cursor: pointer;
                }
                p{
                    margin-top: 20px;
                }
                input[type='text']{
                    margin: 40px 0 0;
                    width: 96%;
                    padding: 2%;
                    height: 40px;
                    border-radius: 4px;
                    outline: none;
                    border: solid 1px #000000;
                    font-size: 1.4em;
                }
                button{
                    display: inline-block;
                    width: 100px;
                    padding: 0 10px;
                    background: $main-color;
                    border-radius: 5px;
                    height: 40px;
                    color: #FFFFFF;
                    font-weight: bold;
                    font-size: 1em;
                    margin: 40px 0 0 140px;
                    &:hover{
                        opacity: .7;
                    }
                }
            }
        }
        .online_status{
            display: inline-block;
            background: #ff4f4c;
            border-radius: 10px;
            width: 10px;
            height: 10px;
        }
        .offline_status{
            display: inline-block;
            background: #c4c4c4;
            border-radius: 10px;
            width: 10px;
            height: 10px;
        }
        .section_title{
            display: flex;
            margin: 10px 0 10px 15px;
            h2{
                vertical-align: middle;
                line-height: 24px;
                height: 24px;
                width: 170px;
            }
            svg{
                width: 24px;
                height: 24px;
                fill: #ffffff;
                vertical-align: middle;
                cursor: pointer;
            }
        }
        .navigation_content{
            height: auto;
            line-height: 1.7em;
            font-size: 1em;
            cursor: pointer;
            padding-left: 25px;

            &:hover{
                background: rgba(255,255,255,.2)
            }
        }
    }
    #channel_area{
        display: inline-block;
        width: 100%;
        vertical-align: top;
        overflow: hidden;
    }
    header{
        width: 100%;
        height: 10vh;
        border-bottom: solid 1px #c0c0c0;
        display: flex;
        #channel_description{
            width: 60%;
            h2{
                padding-left: 20px;
                font-weight: bold;
                font-size: 1.5em;
                line-height: 10vh;
                height: 10vh;
            }
        }
        #channel_button{
            width: 37%;
            text-align: right;
            button{
                display: inline-block;
                width: auto;
                padding: 0 1vw;
                background: $main-color;
                border-radius: 5px;
                height: 5vh;
                color: #FFFFFF;
                font-weight: bold;
                font-size: .8em;
                margin-top: 2.5vh;
                &:hover{
                    opacity: .7;
                }
            }
        }
    }
    main{
        height: 90vh;
        overflow: hidden;
        width: 100%;
        #message_bottom{
            height: 70vh;
            width: 100%;
            overflow-y: scroll;
            font-size: 1em;
            img{
                width: 50px;
                height: 50px;
                object-fit: cover;
            }
            .message_user{
                font-weight: bold;
                margin-left: 10px;
                span{
                    font-weight: normal;
                    font-size: .8em;
                }
            }
            .message_content{
                user-select: auto;
            }
            .message_category{
                margin: 0 0 0 10px;
                display: inline-block;
                background: $main-color;
                height: 15px;
                border-radius: 15px;
                padding: 3px 15px;
                line-height: 15px;
                font-size: .8em;
                color: #FFFFFF;
                width: auto;
            }
            .message{
                background: $main-color;
            }
            .upload{
                background: #ff4f4c;
                cursor: pointer;
                &:hover{
                    opacity: .7;
                }
            }
        }
        #send_message{
            flex-direction: column;
            height: 20vh;
            width: 100%;
            border-top: solid 2px #000000;
            #sendProgress{
                display: block;
                margin-top: -2px;
                height: 2px;
                width: 10%;
                background: #eec000;
            }
            textarea{
                border: none;
                width: 96%;
                margin: 1% 0 0 2%;
                height: 11vh;
                resize: none;
                background: none;
                &:focus{
                    outline: none;
                }
            }
            #button_area{
                width: 100%;
                height: auto;
                padding: 1vh;
                button{
                    margin: 0 0.5vh;
                    background: #f1a90c;
                    padding: 0 10px;
                    border-radius: 5px;
                    font-weight: bold;
                    color: #ffffff;
                    height: 4vh;
                    &:hover{
                        opacity: .7;
                    }
                    vertical-align: middle;
                }
                .filter_area{
                    position: relative;
                    float: right;
                    width: 350px;
                    input[type='text']{
                        position: absolute;
                        z-index: 10;
                        left: 0;
                        height: 3.75vh;
                        line-height: 4vh;
                        font-size: 1em;
                        width: 250px;
                        padding: 0 10px;
                        background: #eeeeee;
                        outline: none;
                        border: solid 1px #919191;
                        border-radius: 5px;
                        vertical-align: middle;
                        margin: 0;
                    }
                    .filter_reset{
                        position: absolute;
                        z-index: 1;
                        left: 265px;
                        height: 4vh;
                        line-height: 4vh;
                        padding-left: 10px;
                        border-radius: 0 5px 5px 0;
                    }
                }
            }
        }
        .message_content{
            display: flex;
            padding: 10px 0 10px 10px;
            img{
                border-radius: 5px;
            }
        }
    }
</style>

<script>
    import firebase from "firebase/app";
    import "firebase/auth";
    import "firebase/storage";
    import "firebase/database";

    import PlusCircle from "./icons/PlusCircle";
    import Avator from "./Avator";

    import "vue-scrollto";

    const child_process = require("child_process");
    const fs = require('fs');
    const path = require("path");
    const shell = require('electron').shell;

    // OSチェック
    const is_windows = process.platform==='win32';
    const is_mac = process.platform==='darwin';
    const is_linux = process.platform==='linux';

    const HOMEDIR =
        process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];

    export default {
        components: {
            PlusCircle,
            Avator
        },
        data() {
            return {
                user: "",
                loginUser: "",
                channelModal: false,
                channel: "",
                users: [],
                channel_name: "",
                channel_description: null,
                message: "",
                messages: [],
                placeholder: "",
                channels: [],
                channel_id: "",
                connection_key: "",
                connectionRef: firebase.database().ref("connections"),
                connections: [],
                pwd: HOMEDIR,       // 作業ディレクトリ
                log: null,          // 標準出力格納用
                targetRepository: null,
                directoryExistence: false,
                messageCategory: 'message',
                localRipository:{
                    parentDir: '',
                    ripositoryDir: '',
                    workDir: '',
                    older: false,
                },
                git: {
                    blanch: 'master',
                },
                messagefilter: {
                    able: true,
                    mode: 'tag',
                    target: null,
                },
                file:{
                    uplod_overlay: false,
                    upload_modal: false,
                    message:'',
                    file:'',
                    url: '',
                },
                commandProgress: 0,
                userObj: [],
                progressWidth: 0,
                checkTimer: null,
                uploadAble: false
            };
        },
        methods: {
            exe(command, pwd = HOMEDIR) {  // コマンド実行関数
                console.log('実行コマンド：' + command);
                console.log('実行ディレクトリ：' + pwd);

                // 実行部分 https://nodejs.org/api/child_process.html
                const child = child_process.exec(command, {
                    cwd: pwd,  // 子プロセスの現在の作業ディレクトリ（デフォルト：null）
                    shell: true     // コマンドを実行するシェル（デフォルト： [Unix]/bin/sh [Windows]process.env.ComSpec）
                });

                // 標準出力表示処理
                /*
                child.stdout.on("data", data => {
                    console.log('std : ' + data);
                });

                // 標準エラー受け取り時の処理
                child.stderr.on("data", data => {
                    console.log('error : ' + data);
                });
                 */

                return child;
            },
            // Git関係
            gitPush() {     // git add / commit / push

                // 文字列が入っているか
                if(this.message === ''){
                    return;
                }
                const blanch = this.git.blanch;
                // コマンド定義
                const commands = [
                    'git add .',
                    'git commit -a -m \"' + this.message + '\"',
                    'git push origin ' + blanch
                ];
                // コマンド実行
                setTimeout(
                    this.progressSet(15),
                    200
                );
                this.exe(commands[0], this.localRipository.workDir).on("close",(code) => {
                    this.progressWidth = 33;
                    setTimeout(
                        this.progressSet(50),
                        200
                    );
                    this.exe(commands[1], this.localRipository.workDir).on("close",(code) => {
                        this.progressWidth = 66;
                        setTimeout(
                            this.progressSet(88),
                            500
                        );
                        setTimeout(
                            this.progressSet(90),
                            1000
                        );

                        const push_child = this.exe(commands[2], this.localRipository.workDir);

                        let commitID = null;

                        push_child.stderr.on("data", data => {
                            console.log(data);
                            console.log(data.indexOf('..'));
                            console.log('commitID : ' + data.substring(data.indexOf('..') + 2).substring(0,7));
                            commitID = data.substring(data.indexOf('..') + 2).substring(0,7);
                        });

                        push_child.on("close",(code) => {
                            this.progressWidth = 100;
                            this.messageCategory = 'upload';

                            // プログレスバーをリセット
                            setTimeout(
                                this.progressSet(0),
                                1000
                            );

                            this.sendMessage(commitID,blanch);

                            // アップロード確認処理
                            this.uploadAble = false;
                            clearInterval(this.checkTimer);
                            this.checkTimer = setInterval(
                                this.checkLocal,
                                5000
                            );
                        });
                    });
                });
            },
            checkLocal(){
                const command = 'git status --short';
                let editFlg = false;
                const child = this.exe(command, this.localRipository.workDir);
                child.stdout.on("data", data => {
                    editFlg = true;
                });
                child.on("close",(code) => {
                    this.uploadAble = editFlg;
                    if(this.uploadAble){
                        clearInterval(this.checkTimer);
                    }
                });
            },
            progressSet(progress){
                this.progressWidth = progress;
            },
            gitClone() {    // リモートリポジトリのクローン

                // コマンド定義
                const command = 'git clone ' + this.targetRepository;
                // ディレクトリの作成
                this.makeDirectory(this.pwd + this.localRipository.parentDir);
                // コマンド実行
                this.exe(
                    command,
                    this.pwd + this.localRipository.parentDir,
                ).on("close",(code) => {    // コマンド終了後処理
                    this.directoryExistence = fs.existsSync(this.localRipository.workDir);
                });
            },
            gitPull(){    // プル
                const command = 'git pull';
                this.exe(
                    command,
                    this.localRipository.workDir
                ).on("close",(code) => {    // コマンド終了後処理
                    this.localRipository.older = false;
                });
            },
            gitAddRemote(){ // リモートリポジトリの追加
                const command = 'git remote add origin ' + this.targetRepository;
                this.exe(command, this.pwd);
            },
            // ディレクトリ操作
            openExplorer(){ // エクスプローラでの表示
                if(is_windows){ // Windows (Explorer)
                    const command = 'explorer.exe ' + this.localRipository.workDir;
                    this.exe(command, HOMEDIR);
                }else{          // Mac(FInder)
                    const command = 'open ' + this.localRipository.workDir;
                    this.exe(command, HOMEDIR);
                }
            },
            directoryCheck(){   // ディレクトリの存在確認
                return fs.existsSync(this.localRipository.workDir);
            },
            makeDirectory(pwd) {
                // ディレクトリ存在確認
                if(! fs.existsSync(pwd)) {
                    let command;
                    // OS毎にコマンド定義
                    if (is_windows) {
                        command = 'mkdir ' + pwd;
                    } else {
                        command = 'mkdir -p ' + pwd;
                    }
                    // コマンド実行
                    this.exe(command, HOMEDIR);
                }
            },
            signOut() {
                this.connectionRef.child(this.connection_key).remove();
                firebase.auth().signOut();
                this.$router.push("/signin");
            },
            // メッセージ関係
            sendMessage(commitID = null,blanch = null) { // メッセージ送信

                if(this.message === ''){
                    return;
                }

                // 新規メッセージ作成
                const newMessage = firebase
                    .database()
                    .ref("messages")
                    .child(this.channel_id)
                    .push();

                const key_id = newMessage.key;

                let content = "";

                if (this.file.url == "") {
                    content = this.message;
                } else {
                    content = this.file.message;
                }

                // 新規メッセージを保存
                newMessage
                    .set({
                        key: key_id,
                        content: content,
                        user: this.user.uid,
                        url: this.file.url,
                        category: this.messageCategory,
                        createdAt: firebase.database.ServerValue.TIMESTAMP,
                        commitID: commitID,
                        blanch: blanch,
                    });

                this.messageCategory = 'message';

                this.file.url == "" ? this.message = "" : this.file.message = "";
                this.file.url = "";
            },
            messageFilter(message){
                if(!this.messagefilter.target){
                    return true;
                }
                if(this.messagefilter.target.charAt(0) === '#'){
                    return (message.category.indexOf(this.messagefilter.target.slice( 1 )) === 0 );
                }else if(this.messagefilter.target.charAt(0) === '@'){
                    return (this.userObj[message.user].name.indexOf(this.messagefilter.target.slice( 1 )) === 0 );
                }else{
                    return (message.content.indexOf(this.messagefilter.target) > -1 );
                }
            },
            usertoObj(user){
                this.userObj[user.user_id] = {
                    name : user.name,
                    email : user.email,
                    icon : user.icon
                };
            },
            convertTime(unixTime){
                const date = new Date(unixTime);
                return date.toLocaleDateString('ja-JP') + ' ' + date.toLocaleTimeString('ja-JP');
            },
            directMessage(user) {
                this.messages = [];
                this.user.uid > user.user_id
                    ? (this.channel_id = this.user.uid + "-" + user.user_id)
                    : (this.channel_id = user.user_id + "-" + this.user.uid);

                clearInterval(this.checkTimer);

                if (this.channel_id != "") {
                    firebase
                        .database()
                        .ref("messages")
                        .child(this.channel_id)
                        .off();
                }


                this.directoryExistence = false;
                this.channel_name = user.name;
                this.placeholder = user.name + "へのメッセージ";
                this.targetRepository = null;

                firebase
                    .database()
                    .ref("messages")
                    .child(this.channel_id)
                    .on("child_added", snapshot => {
                        this.messages.push(snapshot.val());
                        this.$nextTick(() => {
                            let message_bottom = document.getElementById("message_bottom");
                            message_bottom.scrollTop = message_bottom.scrollHeight;
                        });
                    });

            },
            channelMessage(channel) {   // チャンネルごとのメッセージ
                this.messages = [];
                this.channel_name = channel.channel_name;
                this.channel_id = channel.id;
                this.channel_description = channel.description;
                this.placeholder = channel.channel_name + "へのメッセージ";
                this.localRipository.older = false;

                this.userObj = new Object();
                Object.keys(this.users).forEach(
                    user => this.usertoObj(this.users[user])
                );
                console.log('users:');
                console.log(this.userObj);

                // リポジトリ情報の変更
                this.targetRepository = channel.repository;
                this.localRipository.ripositoryDir = this.targetRepository.match(/.*\/(.+?)\./)[1];
                this.localRipository.parentDir =
                    this.targetRepository.replace(/git@github.com:*(.*?).git*/g,"$1")
                        .replace(new RegExp( '/' + this.localRipository.ripositoryDir,"g" ), '');
                // 作業ディレクトリ名を定義
                if(is_windows){
                    this.localRipository.workDir = this.pwd + this.localRipository.parentDir + '\\' + this.localRipository.ripositoryDir;
                }else{
                    this.localRipository.workDir = this.pwd + this.localRipository.parentDir + '/' + this.localRipository.ripositoryDir;
                }

                // ローカルリポジトリの存在確認
                this.directoryExistence = this.directoryCheck();

                // アップロード確認処理
                clearInterval(this.checkTimer);
                this.checkLocal();
                this.checkTimer = setInterval(
                    this.checkLocal,
                    5000
                );

                // リモートリポジトリのバージョン確認
                if(this.directoryExistence){
                    this.exe(
                        'git fetch --dry-run',
                        this.localRipository.workDir,
                    ).stderr.on("data", data => {
                        this.localRipository.older = true;
                    });
                }

                if (this.channel_id !== "") {
                    firebase
                        .database()
                        .ref("messages")
                        .child(this.channel_id)
                        .off();
                }

                firebase
                    .database()
                    .ref("messages")
                    .child(channel.id)
                    .on("child_added", snapshot => {
                        this.messages.push(snapshot.val());
                    });
            },
            addChannel() {
                const newChannel = firebase
                    .database()
                    .ref("channel")
                    .push();

                const key_id = newChannel.key;

                // directory名の抽出
                const directory = this.channel.match(/.*\/(.+?)\./);
                const user =
                    this.channel.replace(/git@github.com:*(.*?).git*/g,"$1")
                        .replace(new RegExp( '/' + directory,"g" ), '');

                // チャンネル名として定義
                newChannel
                    .set({
                        channel_name: user,
                        id: key_id,
                        repository: this.channel,
                        description: ""
                    })
                    .then(() => {
                        this.channelModal = false;
                    });

                this.channel = ''
            },
            showChannelModal() {
                this.channelModal = true;
            },
            closeChannelModal() {
                this.channelModal = false;
            },
            isOnline(user) {
                if (user.status === "online") {
                    return true;
                } else {
                    return false;
                }
            },
            fileUpload() {
                const storageRef = firebase.storage().ref("images/" + this.file.name);
                const uploadTask = storageRef.put(this.file);

                uploadTask.on(
                    "state_changed",
                    snapshot => {
                        let percentage =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        this.$refs.progress_bar.style.width = percentage + "%";
                    },
                    error => {
                        console.log(error);
                    },
                    () => {
                        storageRef.getDownloadURL().then(url => {
                            this.file.url = url;
                            this.sendMessage();
                            this.file.upload_modal = false;
                        });
                    }
                );

            },
            dropFile() {
                //console.log("drop file");
                this.file.file = event.dataTransfer.files[0];
                this.file.upload_modal = true;
                this.file.uplod_overlay = false;
            },
            dragEnter() {
                this.file.uplod_overlay = true;
            },
            dragLeave() {
                this.file.uplod_overlay = false;
            },
            closefileUploadModal() {
                this.file.upload_modal = false;
            },
            openCommit(commitID){   // コミットの詳細を表示
                shell.openExternal('https://github.com/' + this.localRipository.parentDir + '/' + this.localRipository.ripositoryDir + '/commit/' + commitID);
            },
        },
        mounted() {
            this.user = firebase.auth().currentUser;

            // 作業ディレクトリの定義
            if(is_windows){
                this.pwd = this.pwd + "\\chathub\\repository\\";
            }else{
                this.pwd = this.pwd + "/chathub/repository/";
            }
            // 作業ディレクトリが存在しない場合作成
            this.makeDirectory(this.pwd);

            firebase
                .database()
                .ref("users")
                .on("child_added", snapshot => {
                    let user = snapshot.val();

                    if (this.user.uid == user.user_id) {
                        user.status = "online";
                        this.loginUser = user;
                    } else {
                        user.status = "offline";
                    }
                    this.users.push(user);

                });

            firebase
                .database()
                .ref("channel")
                .on("child_added", snapshot => {
                    this.channels.push(snapshot.val());
                    this.channelMessage(this.channels[0]);
                });

            firebase
                .database()
                .ref(".info/connected")
                .on("value", snapshot => {
                    if (snapshot.val() === true) {
                        let ref = this.connectionRef.push();
                        this.connection_key = ref.key;
                        ref.onDisconnect().remove();

                        ref.set({
                            user_id: this.user.uid,
                            key: this.connection_key
                        });
                    }
                });

            firebase
                .database()
                .ref("connections")
                .on("child_added", snapshot => {
                    let new_connection = snapshot.val();
                    this.connections.push(new_connection);

                    let user = this.users.find(
                        user => user.user_id === new_connection.user_id
                    );

                    if (user != undefined) {
                        user.status = "online";
                    }
                });

            firebase
                .database()
                .ref("connections")
                .on("child_removed", snapshot => {
                    let remove_connection = snapshot.val();

                    this.connections = this.connections.filter(
                        connection => connection.key !== remove_connection.key
                    );

                    let index = this.connections.findIndex(connection => {
                        return connection.user_id === remove_connection.user_id;
                    });

                    if (index === -1) {
                        let user = this.users.find(
                            user => user.user_id == remove_connection.user_id
                        );
                        user.status = "offline";
                    }
                });


        },
        beforeDestroy() {
            firebase
                .database()
                .ref("users")
                .off();

            firebase
                .database()
                .ref("messages")
                .child(this.channel_id)
                .off();

            firebase
                .database()
                .ref(".info/connected")
                .off();
        },
        watch: {
            users: function () {
                this.users.forEach(
                    user =>function(){
                        console.log('user' + user);
                    }
                );
            }
        },
    };
</script>