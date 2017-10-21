<template>
    <div class="kanban">
    <div class="kanban__col" v-for="col in compiled">
      <div class="kanban__col-title">{{col.name}}</div>
      <div class="kanban__wrapper">
        <div class="kanban__row" v-for="(card, index) in col.cards" track-by="index">
          {{card}}
        </div>
      </div>
    </div>
    </div>
</template>
<script>
  import MarkdownIt from 'markdown-it';
  const md = new MarkdownIt();

  export default {
    props: {
      "input": String
    },
    computed: {
      compiled: function () {
        var lines = this.input.split(/[\r|\n|\r\n]/);
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
    }
  }
</script>
<style>
</style>