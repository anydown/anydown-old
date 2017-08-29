Vue.component("cc-kanban", {
  props: ['text-data'],
  template: `<div class="kanban">{{textData}}</div>`
})

new Vue({
  el: 'body',
  data: {
    input: "```kanban\ntest\ntest2\n```\n# hello"
  },
  computed: {
    compiledMarkdown: function () {
      var mark = marked(this.input, { sanitize: true })
      var m = /<code class="lang-kanban">([^<]*?)<\/code>/g.exec(mark)[1]
      console.log(m)
      return mark.replace(/<code class="lang-kanban">/g, "<cc-kanban text-data='"+ m +"'>").replace(/<\/code>/g, "</cc-kanban>");
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value
      Vue.nextTick(() => {
        this.$compile(document.querySelector("#output"));
      })
    }, 300),
    compile: function () {
    }
  }
})