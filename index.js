Vue.component("cc-kanban", {
  props: ['text-data'],
  template: `<div class="kanban">
  <div class="kanban__col" v-for="col in kanbanData">
    <div class="kanban__col-title">{{col.name}}</div>
    <div class="kanban__wrapper">
      <div class="kanban__row" v-for="card in col.cards">
        {{card.name}}
      </div>
    </div>
  </div>
  </div>`,
  computed: {
    kanbanData: function () {
      var cardid = 0;
      var lines = this.textData.split(/[\r|\n|\r\n]/);
      var output = [];
      var cards = [];
      lines.forEach(function (line) {
        if (line.trim().indexOf("#") === 0) {
          cards = [];

          output.push({
            name: line.trim().replace("#", "").trim(),
            cards: cards
          });
        } else if (line.trim().indexOf("*") === 0) {
          cards.push({
            name: line.trim().replace("*", "").trim(),
            cardid: cardid++
          });
        }
      });
      return output;
    }
  },
  ready: function(){
    document.querySelectorAll(".kanban__wrapper").forEach((el)=>{
      Sortable.create(el, {
        group: "kanban-group",
        animation: 100
      });

    })
  }
})

var md = new markdownit({
  highlight: function (str, lang) { 
    if(lang && lang === "kanban"){
      return `<pre-disable></pre-disable><cc-kanban text-data='${str}'></cc-kanban>`
    }
    return str;
  }
});

new Vue({
  el: 'body',
  data: {
    input: "#カンバンとmarkdownの交ぜ書き\n\n\n```kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n```\n# hello"
  },
  computed: {
    compiledMarkdown: function () {
      return md.render(this.input)
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value
      Vue.nextTick(() => {
        this.$compile(document.querySelector("#output"));
      })
    }, 300)
  },
  ready: function () {
    Vue.nextTick(() => {
      this.$compile(document.querySelector("#output"));
    })

  }
})
