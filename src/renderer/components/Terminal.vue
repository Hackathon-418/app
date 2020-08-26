 <template>
    <div class="Main">
        <input type="text" v-model="pwd" placeholder="directory">
        <p>
            <input type="text" v-model="commitMessage" placeholder="コミットメッセージ">
            <input type="button" v-on:click="gitPush" value="push">
        </p>
        <p>
            <input type="text" v-model="targetRepository" placeholder="リポジトリ">
            <input type="button" v-on:click="gitClone" value="clone">
        </p>
        <p>
            {{ log }}
        </p>
    </div>
</template>

<style>
.Main {
    position: absolute;
    top: 0;
    padding-top: 30px;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    overflow-y: scroll;
}
    p{
        color: #FFFFFF;
    }
</style>

<script>
const { ipcRenderer } = require("electron");
const child_process = require("child_process");
const path = require("path");
const iconv = require("iconv-lite");

const HOMEDIR =
    process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];

export default {
    data() {
        return {
            commitMessage: null,   // 実行コマンド
            pwd: HOMEDIR,       // 作業ディレクトリ
            log: null,          // 標準出力格納用
            targetRepository: null
        }
    },
    methods: {
        exe(command) {  // コマンド実行関数
            // 実行部分 https://nodejs.org/api/child_process.html
            const child = child_process.exec(command, {
                cwd: this.pwd,  // 子プロセスの現在の作業ディレクトリ（デフォルト：null）
                shell: true     // コマンドを実行するシェル（デフォルト： [Unix]/bin/sh [Windows]process.env.ComSpec）
            });

            // 標準出力表示処理
            child.stdout.on("data", data => {
                console.log(iconv.decode(data, "Shift_JIS"));
                this.log = iconv.decode(data, "Shift_JIS");
            });

            // 標準エラー受け取り時の処理
            child.stderr.on("data", data => {
                console.log(iconv.decode(data, "Shift_JIS"));
            });
        },
        gitPush() {     // git add / commit / push
            const commands = [
                'git add .',
                'git commit -m \"' + this.commitMessage + '\"',
                'git push origin master'
            ];

            for(const command of commands){
                console.log(command);
                this.exe(command);
            }
        },
        gitClone() {    // リモートリポジトリのクローン
            const command = 'git clone ' + this.targetRepository;
            this.exe(command);
        },
        addRemote(){    // リモートリポジトリの追加
            const command = 'git remote add origin ' + this.targetRepository;
            this.exe(command);
        }
    }
}
</script>
