Vue.component("pre-disable", {
  template: `<div></div>`
})

function elToAry(el) {
  return Array.from(el.querySelectorAll(".kanban__col")).map(a => {
    var titleEl = a.querySelector(".kanban__col-title")
    var cardsEl = a.querySelectorAll(".kanban__row")

    return {
      name: titleEl.innerText,
      cards: Array.from(cardsEl).map(n => n.innerText)
    }
  })
}

Vue.component("cc-kanban", {
  props: ['text-data'],
  template: `<div class="kanban">
  <div class="kanban__col" v-for="col in kanbanData">
    <div class="kanban__col-title">{{col.name}}</div>
    <div class="kanban__wrapper">
      <div class="kanban__row" v-for="card in col.cards" track-by="$index">
        {{card}}
      </div>
    </div>
  </div>
  </div>`,
  data: function () {
    return { kanbanData: [] }
  },
  methods: {
    afterDataInit: function () {
      document.querySelectorAll(".kanban__wrapper").forEach((el, idx) => {
        Sortable.create(el, {
          group: "kanban-group",
          animation: 200,
          onUpdate: (/**Event*/evt) => {
            this.$emit("updateText", elToAry(this.$el))
          },
          onRemove: (evt) => {
            this.$emit("updateText", elToAry(this.$el))
          }
        });
      })
    }
  },
  ready: function () {
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
        cards.push(line.trim().replace("*", "").trim());
      }
    });

    this.kanbanData = output
    Vue.nextTick(() => {
      this.afterDataInit()
    })

  }
})

var indexes = {
  kanban: 0
}

var md = new markdownit({
  highlight: function (str, lang) {
    if (lang && lang === "kanban") {
      var render = `<pre-disable></pre-disable><cc-kanban index="${indexes.kanban}" text-data='${str}'></cc-kanban>`
      indexes.kanban += 1
      return render
    }
    return str;
  }
});

new Vue({
  el: 'body',
  data: {
    input: "# カンバンとmarkdownの交ぜ書き\n\n\n```kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n```\n# hello"
  },
  computed: {
    compiledMarkdown: function () {
      indexes.kanban = 0
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
