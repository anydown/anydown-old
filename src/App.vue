<template>
  <div id="editor">
    <textarea v-model="input"></textarea>
    <div id="output">
      <div :is="block.type" :input="block.text" v-for="block in splited" :key="block.id" @change="updateBlock($event, block.id)"></div>
    </div>
  </div>
</template>

<script>
import MarkdownBlock from './MarkdownBlock.vue'
import CodeBlockKanban from './CodeBlockKanban.vue'
import CodeBlockGantt from './CodeBlockGantt.vue'

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
    }
  },
  mounted: function(){
    this.input = "# カンバンとmarkdownの交ぜ書き\n\n\n```kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n```\n# hello\n\n\n```gantt\nタスクA 2017-11-01 2017-11-02\nタスクB 2017-11-03 2017-11-05\nタスクC 2017-11-10 2017-11-15\n```\n";
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

textarea,
#editor #output {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
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

code {
  color: #f66;
}
</style>
