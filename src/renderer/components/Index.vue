<template>
    <div id="index">
        <nav>
            <div id="logo_area">
                <img src="../assets/logo.png">
                <h1>Chat Hub</h1>
            </div>
            <div class="flex items-center">
                <span class="online_status"></span>
                <span>{{ user.email }}</span>
            </div>
            <div class="mt-5 flex justify-between items-center">
                <div class="font-bold  text-lg">チャンネル</div>
                <PlusCircle @click.native="showChannelModal" />
                <div
                        class="z-10 fixed top-0 left-0 h-full w-full flex items-center justify-center"
                        style="background-color:rgba(0,0,0,0.5)"
                        v-show="channelModal"
                        @click="closeChannelModal"
                >
                    <div class="z-20 bg-white text-gray-900 w-1/3 rounded-md" v-on:click.stop>
                        <div class="flex flex-col p-6">
                            <div class="flex justify-between items-center">
                                <h2 class="text-3xl font-black leading-loose">チャンネルを作成する</h2>
                                <span @click="closeChannelModal" class="text-4xl">×</span>
                            </div>
                            <p>チャンネルはチームがコニュニケーションを取る場所です。特定のトピックに基づいてチャンネルを作ると良いでしょう。(例: #マーケティング)</p>
                            <div class="mt-8 font-semibold">名前</div>
                            <div class="my-3">
                                <input
                                        type="text"
                                        class="w-full rounded border-gray-900 border-solid border p-3"
                                        v-model="channel"
                                />
                            </div>
                            <div class="flex justify-end">
                                <button
                                        class="px-8 py-2 rounded bg-green-900 font-bold text-white"
                                        @click="addChannel"
                                >作成</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                    @click="channelMessage(channel)"
                    class="mt-1"
                    v-for="channel in channels"
                    :key="channel.id"
            ># {{ channel.channel_name }}</div>
            <div class="mt-5 flex justify-between items-center">
                <div class="font-bold text-lg">ダイレクトメッセージ</div>
            </div>
            <div class="mt-2 flex items-center" v-for="user in users" :key="user.user_id">
                <span :class="[isOnline(user) ? 'online_status' : 'offline_status']"></span>
                <span class="" @click="directMessage(user)">{{ user.email }}</span>
            </div>
        </nav>

        <!-- Chat -->
        <div id="chanel_area">
            <header>
                <h2>{{ channel_name }}</h2>
                <button class="py-2 px-4 bg-orange-500 text-white rounded font-semibold" @click="signOut">サインアウト</button>
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
                    <div class="flex-grow overflow-y-scroll" id="message_bottom">
                        <div
                                class="mt-2 mb-4 flex"
                                v-for="message in messages"
                                :key="message.key"
                                style="pointer-events: none"
                        >
                            <Avator :user="message.user" />
                            <div class="ml-2">
                                <div class="font-bold">{{ message.user }}</div>
                                <div>{{ message.content }}</div>
                                <div v-if="message.url">
                                    <img src="https://image.flaticon.com/icons/png/512/129/129492.png" width="64px" height="64px"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="border border-gray-900 rounded mb-4">
            <textarea
                    class="w-full pt-4 pl-8 outline-none"
                    :placeholder="placeholder"
                    v-model="message"
            ></textarea>
                        <div class="bg-gray-100 p-2">
                            <button
                                    class="bg-orange-500 text-base text-white font-bold py-1 px-2 rounded"
                                    @click="sendMessage"
                            >送信</button>
                        </div>
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
        width: 290px;
        height: 100vh;
        padding-left: 15px;
        background: linear-gradient(-45deg, #00d9b4, #6ee887);
        vertical-align: top;
        color: #FFFFFF;
        #logo_area{
            margin: 10px 0 0;
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
    }
    #chanel_area{
        display: inline-block;
        width: auto;
        vertical-align: top;
    }
    header{
        width: 100%;
        height: 100px;
        border-bottom: solid 2px #888888;
        h2{
            font-weight: bold;
            font-size: 2em;
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

    export default {
        components: {
            PlusCircle,
            Avator
        },
        data() {
            return {
                user: "",
                channelModal: false,
                channel: "",
                users: [],
                channel_name: "",
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
                url: ''
            };
        },
        methods: {
            moveLink(url){
                window.open(url,'_blank')
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
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    })

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

                this.channel_name = user.email;
                this.placeholder = user.email + "へのメッセージ";

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
            channelMessage(channel) {
                this.messages = [];
                this.channel_name = "# " + channel.channel_name;
                this.channel_id = channel.id;

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
            },
            addChannel() {
                const newChannel = firebase
                    .database()
                    .ref("channel")
                    .push();

                const key_id = newChannel.key;

                newChannel
                    .set({
                        channel_name: this.channel,
                        id: key_id
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
                console.log("drop file");
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

            firebase
                .database()
                .ref("users")
                .on("child_added", snapshot => {
                    let user = snapshot.val();

                    if (this.user.uid == user.user_id) {
                        user.status = "online";
                    } else {
                        user.status = "offline";
                    }
                    console.log(user.status)
                    this.users.push(user);
                    console.log(this.users)
                });

            firebase
                .database()
                .ref("channel")
                .on("child_added", snapshot => {
                    this.channels.push(snapshot.val());
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