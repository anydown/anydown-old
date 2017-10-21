<template>
  <div class="kanban">
    <div class="kanban__col" v-for="col in compiled">
      <div class="kanban__col-title">{{col.name}}</div>
      <div class="kanban__wrapper">
        <draggable v-model="col.cards" :options="{group:'everykanban'}">
          <div class="kanban__row" v-for="(card, index) in col.cards" track-by="index">
            {{card}}
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'
  import MarkdownIt from 'markdown-it';
  const md = new MarkdownIt();

  function compileKanban(input) {
    var lines = input.split(/[\r|\n|\r\n]/);
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
    return output
  }

  export default {
    props: {
      "input": String
    },
    data() {
      return {
        compiled: []
      }
    },
    watch: {
      "input": function () {
        this.compiled = compileKanban(this.input)
      }
    },
    components: {
      draggable
    },
    mounted: function(){
      this.compiled = compileKanban(this.input)
    }
  }
</script>
<style>
</style>