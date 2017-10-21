<template>
  <svg width="600" :height="tasks.length * 32">
    <rect class="background" x="0" y="0"  width="600" :height="tasks.length * 32"></rect>
    <line v-for="line in lines" :x1="line" y1="0" :x2="line" :y2="tasks.length * 32" style="stroke:rgb(253, 253, 253);stroke-width:2" />
    <g v-for="(task, index) in tasks" :transform="'translate(' + scale(task.start) + ',' + index * 32 + ')'">
      <rect class="task" x="0" y="4" :width="scaleLength(task.end - task.start)" height="24"></rect>
      <text x="-10" y="20" font-size="12" text-anchor="end" fill="black" line-height="32" >{{task.name}}</text>
    </g>
  </svg>
</template>
<script>
  function getRelativeDate(day){
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0)
    d.setSeconds(0);
    d.setMilliseconds(0)
    d.setDate(d.getDate() + day)
    return d
  }
  function getNewDate(str){
    var d = new Date(str);
    d.setHours(0);
    d.setMinutes(0)
    d.setSeconds(0);
    d.setMilliseconds(0)
    return d;
  }

  export default {
    props: {
      "input": String
    },
    data() {
      return {
        lines: [],
        displayRange: [-2, 24],
        svgWidth: 600
      }
    },
    methods: {
      scaleLength: function(epocdiff){
        return epocdiff / (24 * 60 * 60 * 1000) * this.svgWidth / this.displayRangeLength
      },
      scale: function(epoc){
        var start = getRelativeDate(this.displayRange[0]).getTime();
        var end = getRelativeDate(this.displayRange[1]).getTime();
        var len = end - start;
        var a = epoc - start;
        var t = a / len * this.svgWidth;
        return Math.round(t);
      },
      generateLine: function(){
        var lines = []
        var start = getRelativeDate(this.displayRange[0]).getTime();
        var end = getRelativeDate(this.displayRange[1]).getTime();
        var len = end - start;
        for(let i = 0; i < this.displayRangeLength; i++){
          var ab = getRelativeDate(-2 + i).getTime();
          var a = ab - start;
          var t = a / len * this.svgWidth;
          lines.push(Math.round(t))
        }
        this.lines = lines;
      }
    },
    computed: {
      displayRangeLength: function(){
        return (this.displayRange[1] - this.displayRange[0]);
      },
      tasks: function () {
        var data = this.input.split("\n").filter(item => item.length > 0);
        //最初の一行を除去
        data.shift();
        return data.map((item) => {
          var ary = item.split(" ");
          return {
            name: ary[0],
            start: getNewDate(ary[1]).getTime(),
            end: getNewDate(ary[2]).getTime()
          }
        })
      }
    },
    mounted: function(){
      this.generateLine();
    }
  }
</script>
<style>
.task{
  fill:rgb(187, 187, 255);
  stroke-width:1;
  stroke:rgb(0,0,0);
}
.background{
  fill: rgb(218, 218, 218);
}
</style>