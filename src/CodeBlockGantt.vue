<template>
  <svg width="600" :height="tasks.length * 32 + 32">
    <g transform="translate(0, 32)">
        <rect class="background" x="0" y="0"  width="600" :height="tasks.length * 32"></rect>
        <text v-for="line in lines" :x="line.x + 12" y="-8" text-anchor="middle" font-size="0.8rem" :fill="line.color">{{line.label}}</text>
        <line v-for="line in lines" :x1="line.x" y1="0" :x2="line.x" :y2="tasks.length * 32" style="stroke:rgb(253, 253, 253);stroke-width:2" />
        <g v-for="(task, index) in tasks" :transform="'translate(' + scale(task.start) + ',' + index * 32 + ')'">
          <rect class="task" x="0" y="4" :width="scaleLength(task.end - task.start)" height="24"></rect>
          <text x="-10" y="20" font-size="12" text-anchor="end" fill="black" line-height="32" >{{task.name}}</text>
        </g>
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
          var reldate = getRelativeDate(-2 + i)
          var ab = reldate.getTime();
          var a = ab - start;
          var t = a / len * this.svgWidth;
          let color = "#888888";
          if(reldate.getDay() === 0){
            color = "#FF8888";
          }
          if(reldate.getDay() === 6){
            color = "#8888FF";
          }
          lines.push({x: Math.round(t), label: reldate.getDate(), color: color})
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
  fill:rgb(144, 144, 255);
}
.background{
  fill: #f5f5f5;
}
</style>