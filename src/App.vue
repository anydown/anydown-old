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
import CodeBlock from './CodeBlock.vue'

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
        return {
          text: block,
          type: index % 2 === 0 ? "markdown-block" : "code-block",
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
    this.input = "# カンバンとmarkdownの交ぜ書き\n\n\n```kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n```\n# hello";
  },
  components: {
    MarkdownBlock,
    CodeBlock
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
