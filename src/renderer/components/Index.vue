<template>
    <div id="index">
        <!-- navigation -->
        <nav>
            <div id="logo_area">
                <img src="../assets/logo.png">
                <h1>ChatHub</h1>
            </div>
            <div id="user_info">
                <Avator :user="user.email" />
                <span class="online_status"></span>
                <div>
                    <p>{{ loginUser.name }}</p>
                    <button class="py-2 px-4 bg-orange-500 text-white rounded font-semibold" @click="signOut">サインアウト</button>
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
            ># {{ channel.channel_name }}</div>
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
                    <button v-if="directoryExistence" @click="gitFetch">アップデート</button>
                    <button v-if="directoryExistence" @click="openExplorer">フォルダを開く</button>
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
                        v-show="file_uplod_overlay"
                        style="pointer-events: none"
                >
                    <p class="font-bold text-4xl"> Chat Hubへアップロードする</p>
                </div>
                <div
                        class="z-10 fixed top-0 left-0 h-full w-full flex items-center justify-center"
                        style="background-color:rgba(0,0,0,0.5)"
                        v-show="file_upload_modal"
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
                        v-model="file_message"
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
                            >
                                <Avator :user="message.user" />
                                <div>
                                    <div class="message_user">{{ message.user }}</div>
                                    <div class="message_content">{{ message.content }}</div>
                                    <div v-if="message.url">
                                        <img src="https://image.flaticon.com/icons/png/512/129/129492.png" width="64px" height="64px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="send_message">
                        <textarea
                                :placeholder="placeholder"
                                v-model="message"
                        ></textarea>
                        <button @click="sendMessage">送信</button>
                        <button v-if="directoryExistence" @click="gitPush">アップロード</button>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style lang="scss">
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
        padding-left: 15px;
        background: linear-gradient(-45deg, #00d9b4, #6ee887);
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
                    display: inline-block;
                    line-height: 25px;
                    height: 25px;
                    padding-left: 5px;
                }
                button{
                    margin: 4px 0 0 10px;
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 0 20px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 0.7em;
                    color: #00d9b4;
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
                    margin: 20px 0 0;
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
                    width: 60px;
                    padding: 0 10px;
                    background: #00ea8b;
                    border-radius: 5px;
                    height: 5vh;
                    color: #FFFFFF;
                    font-weight: bold;
                    font-size: .8em;
                    margin: 20px 0 0 155px;
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
            margin: 10px 0;
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
            margin-left: 10px;
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
                background: #00ea8b;
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
        #message_bottom{
            height: 65vh;
            width: 100%;
            overflow-y: scroll;
            .message_user{
                font-weight: bold;
                margin-left: 10px;
            }
            .message_content{
                user-select: auto;
            }
        }
        #send_message{
            height: 16vh;
            width: 93%;
            border: solid 2px #000000;
            border-radius: 3px;
            margin: 1vh 2% 0;
            padding: 1%;
            textarea{
                border: none;
                width: 100%;
                height: 10vh;
                resize: none;
                background: none;
                &:focus{
                    outline: none;
                }
            }
            button{
                background: #ff4f4c;
                padding: 5px 10px;
                border-radius: 5px;
                font-weight: bold;
                color: #FFFFFF;
            }
        }
        .message_content{
            display: flex;
            padding: 10px 0 10px 20px;
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
                file_uplod_overlay: false,
                file_upload_modal: false,
                file_message:'',
                file:'',
                url: '',
                pwd: HOMEDIR,       // 作業ディレクトリ
                log: null,          // 標準出力格納用
                targetRepository: null,
                directoryExistence: false,
                messageCategory: 'message',
            };
        },
        methods: {
            exe(command, pwd) {  // コマンド実行関数
                console.log('実行コマンド：' + command);
                console.log('実行ディレクトリ：' + pwd);

                // 実行部分 https://nodejs.org/api/child_process.html
                const child = child_process.exec(command, {
                    cwd: pwd,  // 子プロセスの現在の作業ディレクトリ（デフォルト：null）
                    shell: true     // コマンドを実行するシェル（デフォルト： [Unix]/bin/sh [Windows]process.env.ComSpec）
                });

                // 標準出力表示処理
                child.stdout.on("data", data => {
                    console.log('std : ' + data);
                    return 1;
                });

                // 標準エラー受け取り時の処理
                child.stderr.on("data", data => {
                    console.log('error : ' + data);
                    return 0;
                });
            },
            gitPush() {     // git add / commit / push
                const commands = [
                    'git add .',
                    'git commit -a -m \"' + this.message + '\"',
                    'git push origin master'
                ];
                const directory = this.targetRepository.match(/.*\/(.+?)\./);

                for(const command of commands){
                    this.exe(command, this.pwd + directory[1]);
                }
                this.messageCategory = 'upload';
                this.sendMessage();
            },
            gitClone() {    // リモートリポジトリのクローン
                const command = 'git clone ' + this.targetRepository;
                this.exe(command, this.pwd);
                this.directoryCheck();
            },
            gitFetch(){    // フェッチ
                const command = 'git fetch';
                this.exe(command, this.pwd);
            },
            gitAddRemote(){ // リモートリポジトリの追加
                const command = 'git remote add origin ' + this.targetRepository;
                this.exe(command, this.pwd);
            },
            openExplorer(){ // エクスプローラでの表示
                // ディレクトリ名を取得
                let directory = this.targetRepository.match(/.*\/(.+?)\./);
                if (directory && directory.length > 1)
                {
                    const command = 'explorer.exe ' + this.pwd + directory[1];
                    this.exe(command);
                }
            },
            directoryCheck(){   // ディレクトリの存在確認
                // ディレクトリ名を取得
                if(this.targetRepository){
                    let directory = this.targetRepository.match(/.*\/(.+?)\./);
                    if (directory && directory.length > 1)
                    {
                        if(process.platform === 'win32'){   // Windows
                            const child = child_process.exec("dir /B " + this.pwd + directory[1], {
                                cwd: this.pwd,  // 子プロセスの現在の作業ディレクトリ（デフォルト：null）
                                shell: true     // コマンドを実行するシェル（デフォルト： [Unix]/bin/sh [Windows]process.env.ComSpec）
                            });

                            // 標準出力表示処理
                            child.stdout.on("data", data => {
                                this.directoryExistence = true;
                            });

                            // 標準エラー受け取り時の処理
                            child.stderr.on("data", data => {
                                this.directoryExistence = false;
                            });
                        }
                    }
                }
            },
            signOut() {
                this.connectionRef.child(this.connection_key).remove();
                firebase.auth().signOut();
                this.$router.push("/signin");
            },
            sendMessage() {
                const newMessage = firebase
                    .database()
                    .ref("messages")
                    .child(this.channel_id)
                    .push();

                const key_id = newMessage.key;

                let content = "";

                if (this.url == "") {
                    content = this.message;
                } else {
                    content = this.file_message;
                }

                newMessage
                    .set({
                        key: key_id,
                        content: content,
                        user: this.user.email,
                        url: this.url,
                        category: this.messageCategory,
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    });

                this.messageCategory = 'message';

                this.url == "" ? this.message = "" : this.file_message = "";
                this.url = "";
            },
            directMessage(user) {
                this.messages = [];
                this.user.uid > user.user_id
                    ? (this.channel_id = this.user.uid + "-" + user.user_id)
                    : (this.channel_id = user.user_id + "-" + this.user.uid);

                if (this.channel_id != "") {
                    firebase
                        .database()
                        .ref("messages")
                        .child(this.channel_id)
                        .off();
                }


                this.directoryExistence = false;
                this.channel_name = user.name;
                this.placeholder = user.email + "へのメッセージ";
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

                // 最下部までスクロール
                this.scrollBottom();
            },
            channelMessage(channel) {   // チャンネルごとのメッセージ
                this.messages = [];
                this.channel_name = "# " + channel.channel_name;
                this.channel_id = channel.id;
                this.channel_description = channel.description;
                this.placeholder = "#" + channel.channel_name + "へのメッセージ";

                this.targetRepository = channel.repository;
                this.directoryCheck();

                if (this.channel_id != "") {
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

                // 最下部までスクロール
                this.scrollBottom();
            },
            scrollBottom() {
                let message_area = this.$el.querySelector("#message_bottom");
                let message_wrapper = this.$el.querySelector("#message_wrapper");
                this.$el.querySelector("#message_bottom").scrollTop = message_wrapper.scrollHeight - message_area.clientHeight;
            },
            addChannel() {
                const newChannel = firebase
                    .database()
                    .ref("channel")
                    .push();

                const key_id = newChannel.key;

                const directory = this.channel.match(/.*\/(.+?)\./);

                newChannel
                    .set({
                        channel_name: directory[1],
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
                            this.url = url;
                            this.sendMessage();
                            this.file_upload_modal = false;
                        });
                    }
                );

            },
            dropFile() {
                //console.log("drop file");
                this.file = event.dataTransfer.files[0];
                this.file_upload_modal = true;
                this.file_uplod_overlay = false;
            },
            dragEnter() {
                this.file_uplod_overlay = true;
            },
            dragLeave() {
                this.file_uplod_overlay = false;
            },
            closefileUploadModal() {
                this.file_upload_modal = false;
            }
        },
        mounted() {
            this.user = firebase.auth().currentUser;

            console.log(process.platform);

            if(process.platform==='win32'){
                this.pwd = this.pwd + "\\chathub\\repository\\";
                if(! fs.existsSync(this.pwd)){
                    const command = 'mkdir ' + this.pwd;
                    this.exe(command, this.pwd);
                }
            }else{
                this.pwd = this.pwd + "/chathub/repository/";
                if(! fs.existsSync(this.pwd)){
                    const command = 'mkdir -p ' + this.pwd;
                    this.exe(command, this.pwd);
                }
            }

            console.log(this.pwd);

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
        }
    };
</script>