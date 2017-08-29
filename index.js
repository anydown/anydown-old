Vue.component("cc-kanban", {
  template: `<div class="kanban">!!!</div>`
})


new Vue({
  el: 'body',
  data: {
    input: "```kanban\ntest\ntest2\n```\n# hello"
  },
  computed: {
    compiledMarkdown: function () {
      var mark = marked(this.input, { sanitize: true })
      return mark.replace(/<code class="lang-kanban">/g, "<cc-kanban>").replace(/<\/code>/g, "</cc-kanban>");
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