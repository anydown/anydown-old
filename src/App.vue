<template>
  <div id="editor">
    <textarea v-model="input"></textarea>
    <div id="output" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();

export default {
  name: 'app',
  data () {
    return {
      input: "# カンバンとmarkdownの交ぜ書き\n\n\n```kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n```\n# hello"
    }
  },
  computed: {
    compiledMarkdown: function () {
      return md.render(this.input)
    }
  },
  methods: {
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

.kanban{
  display: flex;
}

.kanban__col{
  flex: 1;
  border: 1px solid black;
  margin: 0.5rem;
  padding: 0.5rem;

}

.kanban__row{
  margin: 0.5rem;
  padding: 0.5rem;
  border: 1px solid black;
}

.kanban__wrapper{
  min-height: 20rem;
}
</style>
