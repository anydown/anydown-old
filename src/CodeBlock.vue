<template>
  <div class="kanban">
    <div class="kanban__col" v-for="(col, colIndex) in compiled">
      <div class="kanban__col-title">{{col.name}}</div>
      <div class="kanban__wrapper">
        <draggable v-model="col.cards" :options="{group:'everykanban'}" class="draggable--max" @change="onEnd">
          <div class="kanban__row" v-for="(card, index) in col.cards" track-by="index" @dblclick="edit(colIndex, index)">
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
  import * as compiler from './kanban-compiler'
  const md = new MarkdownIt();

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
        this.compiled = compiler.compileKanban(this.input)
      }
    },
    computed: {
      output: function(){
        this.compiled.join()
      }
    },
    components: {
      draggable
    },
    mounted: function () {
      this.compiled = compiler.compileKanban(this.input)
    },
    methods: {
      onEnd: function(){
        this.$emit("change", compiler.serializeKanban(this.compiled));
      },
      edit: function(col, row){
        const oldData = this.compiled[col].cards[row]
        var task = window.prompt("Input task name", oldData);
        this.$set(this.compiled[col].cards, row, task)
        this.$emit("change", compiler.serializeKanban(this.compiled));
      }
    }
  }
</script>
<style>
  .draggable--max {
    flex: 1;
  }

  .kanban {
    display: flex;
  }

  .kanban__col {
    flex: 1;
    border: 1px solid black;
    margin: 0.5rem;
    padding: 0.5rem;

  }

  .kanban__row {
    margin: 0.5rem;
    padding: 0.5rem;
    border: 1px solid black;
  }

  .kanban__wrapper {
    min-height: 20rem;
    display: flex;
    flex-direction: column;
  }
</style>