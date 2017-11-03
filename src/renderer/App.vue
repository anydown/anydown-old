<template>
  <div id="editor">
    <div id="input">
      <codemirror v-model="input" :options="codeMirrorOption"></codemirror>
    </div>
    
    <!--<textarea id="input" v-model="input"></textarea>-->
    <div id="output">
      <div :is="block.type" :input="block.text" v-for="block in splited" :key="block.id" @change="updateBlock($event, block.id)"></div>
    </div>
  </div>
</template>

<script>
import MarkdownBlock from "./MarkdownBlock.vue";
import CodeBlockKanban from "./CodeBlockKanban.vue";
import CodeBlockGantt from "./CodeBlockGantt.vue";
import { codemirror } from "vue-codemirror-lite";
import { example } from "./example.js";
import menu from "./menu";
const LOCALSTORAGE_KEY = "anydown_data";
const LOCALSTORAGE_LAST_EDITED_FILE = "anydown_last_edited_file";
require("codemirror/mode/markdown/markdown");
require("codemirror/addon/edit/continuelist.js");

import "codemirror/theme/monokai.css";

const filters = [
  {
    name: "Documents",
    extensions: ["txt", "md"]
  }
];

export default {
  name: "app",
  data() {
    return {
      input: "",
      splited: [],
      path: "",
      codeMirrorOption: {
        mode: "markdown",
        extraKeys: { Enter: "newlineAndIndentContinueMarkdownList" },
        lineNumbers: true,
        theme: "monokai",
        lineWrapping: true
      }
    };
  },
  computed: {
    compiledMarkdown() {
      return md.render(this.input);
    }
  },
  watch: {
    input() {
      localStorage.setItem(LOCALSTORAGE_KEY, this.input);
      this.splited = this.input.split("```").map((block, index) => {
        //必ず奇数indexがcode blockになる
        let type = "markdown-block";
        if (index % 2 === 1) {
          if (block.indexOf("kanban") === 0) {
            type = "code-block-kanban";
          }
          if (block.indexOf("gantt") === 0) {
            type = "code-block-gantt";
          }
        }
        return {
          text: block,
          type: type,
          id: index
        };
      });
    }
  },
  methods: {
    updateBlock(a, b) {
      this.splited[b].text = a;
      this.input = this.splited.map(i => i.text).join("```");
    },
    loadExample() {
      if (window.confirm("現在のノートを破棄しますが、よろしいですか？")) {
        this.input = example;
      }
    },
    readFile(path) {
      var electronFs = this.$electron.remote.require("fs");
      electronFs.readFile(path, "utf8", (err, text) => {
        if (err && err.code === "ENOENT") {
          alert("以下のファイルが存在しません: \n" + path);
          this.setPath("");
          return;
        }
        if (err) {
          alert(err);
          return;
        }
        if (!err) {
          this.input = text;
          this.setPath(path);
        }
      });
    },
    writeFile(path, text) {
      var electronFs = this.$electron.remote.require("fs");
      electronFs.writeFile(path, text, "utf8", err => {
        if (err) {
          alert(err);
        }
      });
    },
    newFile() {
      (this.path = ""), this.setPath("");
    },
    menuNewFile() {
      this.newFile();
    },
    setPath(path) {
      this.path = path;
      localStorage.setItem(LOCALSTORAGE_LAST_EDITED_FILE, path);
      if (this.path === "") {
        document.title = "anydown - untitled";
      } else {
        document.title = "anydown - " + path;
      }
    },
    menuSaveFile() {
      if (this.path === "") {
        this.menuSaveAs();
      } else {
        this.writeFile(this.path, this.input);
      }
    },
    menuSaveAs() {
      const remote = this.$electron.remote;
      const focusedWindow = remote.BrowserWindow.getFocusedWindow();
      const savePath = remote.dialog.showSaveDialog(focusedWindow, {
        title: "保存",
        filters: filters
      });
      if (savePath) {
        this.setPath(savePath);
        this.writeFile(savePath, this.input);
      }
    },
    menuOpenFile() {
      const remote = this.$electron.remote;
      const focusedWindow = remote.BrowserWindow.getFocusedWindow();
      remote.dialog.showOpenDialog(
        focusedWindow,
        {
          title: "ファイルを開く",
          filters: filters,
          properties: ["openFile"]
        },
        item => {
          if (item) {
            this.readFile(item[0]);
          }
        }
      );
    }
  },
  mounted() {
    /*
    const storage = localStorage.getItem(LOCALSTORAGE_KEY);
    if (storage) {
      this.input = storage;
    } else {
      this.input = example;
    }
    */
    const lastEditedFile = localStorage.getItem(LOCALSTORAGE_LAST_EDITED_FILE);
    if (lastEditedFile) {
      this.readFile(lastEditedFile);
    }

    if(this.$electron){
      menu.openFile = this.menuOpenFile;
      menu.newFile = this.menuNewFile;
      menu.saveFile = this.menuSaveFile;
      menu.saveAsFile = this.menuSaveAs;
      menu.ready(this.$electron);
    }
  },
  components: {
    MarkdownBlock,
    CodeBlockKanban,
    CodeBlockGantt,
    codemirror
  }
};
</script>

<style>
html,
body,
#editor {
  margin: 0;
  height: 100%;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
}

#editor {
  display: flex;
  overflow-y: hidden;
}

#input {
  flex: 1;
  height: 100%;
}

#output {
  flex: 1.5;
  overflow-y: scroll;
  padding: 1rem;
}

.CodeMirror {
  height: 100% !important;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  padding: 20px;
}
.output__header {
  height: 2.4rem;
  line-height: 2.4rem;
  background: #333;
  color: white;
  display: flex;
  justify-content: flex-end;
}
.output__preview {
  padding: 1rem;
}
.output__header__item {
  font-size: 0.8rem;
  padding: 0 1rem;
  cursor: pointer;
}
.output__header__item:hover {
  background: #111;
}

code {
  color: #f66;
}

@media print {
  #input {
    display: none;
  }
  #output {
    overflow-y: visible;
  }
  .output__header {
    display: none;
  }
}
</style>
