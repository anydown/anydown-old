<template>
  <div id="editor">
    <textarea id="input" v-model="input"></textarea>
    <div id="output">
      <div class="output__header">
          <div class="output__header__item" @click="loadExample">サンプル読込</div>
      </div>
      <div class="output__preview">
          <div :is="block.type" :input="block.text" v-for="block in splited" :key="block.id" @change="updateBlock($event, block.id)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownBlock from './MarkdownBlock.vue'
import CodeBlockKanban from './CodeBlockKanban.vue'
import CodeBlockGantt from './CodeBlockGantt.vue'
import {example} from './example.js'

const LOCALSTORAGE_KEY = "plainplan_data"

export default {
  name: 'app',
  data () {
    return {
      input: "",
      splited: []
    }
  },
  computed: {
    compiledMarkdown: function () {
      return md.render(this.input)
    }
  },
  watch: {
    "input": function(){
      localStorage.setItem(LOCALSTORAGE_KEY, this.input);
      this.splited = this.input.split("```").map((block, index)=>{
        //必ず奇数indexがcode blockになる
        let type = "markdown-block"
        if(index % 2 === 1){
          if(block.indexOf("kanban") === 0){
            type = "code-block-kanban";
          }
          if(block.indexOf("gantt") === 0){
            type = "code-block-gantt";
          }
        }
        return {
          text: block,
          type: type,
          id: index
        }
      });
    }
  },
  methods: {
    updateBlock: function(a, b){
      this.splited[b].text = a;
      this.input = this.splited.map(i => i.text).join("```")
    },
    loadExample: function(){
      if(window.confirm("現在のノートを破棄しますが、よろしいですか？")){
        this.input = example;
      }
    }
  },
  mounted: function(){
    const storage = localStorage.getItem(LOCALSTORAGE_KEY);
    if(storage){
      this.input = storage;
    }else{
      this.input = example;
    }
  },
  components: {
    MarkdownBlock,
    CodeBlockKanban,
    CodeBlockGantt
  }
}
</script>

<style>
html,
body,
#editor {
  margin: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

#editor{
  display: flex;
}

#input{
  flex: 1;
  height: 100%;
}

#output{
  flex: 1.5;
  overflow-y: scroll;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}
.output__header{
  height: 2.4rem;
  line-height: 2.4rem;
  background: #333;
  color: white;
  display: flex;
  justify-content: flex-end;
}
.output__preview{
  padding: 1rem;
}
.output__header__item{
  font-size: 0.8rem;
  padding: 0 1rem;
  cursor: pointer;
}
.output__header__item:hover{
  background: #111;
}

code {
  color: #f66;
}

@media print {
  #input{
    display: none;
  }
  #output{
    overflow-y:visible;
  }
  .output__header{
    display: none;
  }
}
</style>
