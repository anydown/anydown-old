<template>
  <svg :width="svgWidth" :height="tasks.length * 32 + 32">
    <!-- 全体を32px下げる（日付用余白） -->
    <g transform="translate(0, 32)">
      <!-- 背景 -->
      <rect class="background" x="0" y="0" :width="svgWidth" :height="tasks.length * 32"></rect>
      <!-- 日付 -->
      <text v-for="line in lines" :x="line.x + 12" y="-8" text-anchor="middle" font-size="0.8rem" :fill="line.color">{{line.label}}</text>
      <!-- 日付区切り線 -->
      <line v-for="line in lines" :x1="line.x" y1="0" :x2="line.x" :y2="tasks.length * 32" class="gridline" 　/>
      <!-- タスク -->
      <g v-for="(task, index) in tasks" :transform="'translate(' + scale(task.start) + ',' + index * 32 + ')'">
        <rect class="task" x="0" y="4" :width="scaleLength(task.end - task.start)" height="24"></rect>
        <text x="-4" y="20" font-size="12" text-anchor="end" fill="black" line-height="32">{{task.name}}</text>
      </g>
    </g>
  </svg>
</template>
<script>
  function resetHMS(d) {
    d.setHours(0);
    d.setMinutes(0)
    d.setSeconds(0);
    d.setMilliseconds(0)
    return d;
  }
  function getRelativeDate(day) {
    let d = new Date();
    resetHMS(d)
    d.setDate(d.getDate() + day)
    return d
  }
  function getNewDate(str) {
    let d = new Date(str);
    resetHMS(d)
    return d;
  }
  var scale = require("d3-scale")

  export default {
    props: {
      "input": String
    },
    data() {
      return {
        lines: [],
        displayRange: {
          start: -2,
          end: 24
        },
        svgWidth: 600
      }
    },
    methods: {
      scaleLength(epocdiff) {
        return epocdiff / (24 * 60 * 60 * 1000) * this.svgWidth / this.displayRangeLength
      },
      scale(epoc) {
        return scale.scaleLinear().domain(this.timeRange).range([0, this.svgWidth])(epoc)
      },
      generateLine() {
        let lines = []
        const start = this.timeRange[0];
        const end = this.timeRange[1];
        const len = end - start;
        for (let i = 0; i < this.displayRangeLength; i++) {
          const reldate = getRelativeDate(this.displayRange.start + i)
          const t = (reldate.getTime() - start) / len * this.svgWidth;
          let color = "#888888";
          if (reldate.getDay() === 0) {
            color = "#FF8888";
          }
          if (reldate.getDay() === 6) {
            color = "#8888FF";
          }
          lines.push({ x: Math.round(t), label: reldate.getDate(), color: color })
        }
        this.lines = lines;
      }
    },
    computed: {
      timeRange() {
        return [
          getRelativeDate(this.displayRange.start).getTime(),
          getRelativeDate(this.displayRange.end).getTime()
        ]
      },
      displayRangeLength() {
        return (this.displayRange.end - this.displayRange.start);
      },
      tasks() {
        let data = this.input.split("\n").filter(item => item.length > 0);
        //最初の一行を除去
        data.shift();
        return data.map((item) => {
          const ary = item.split(" ");
          return {
            name: ary[0],
            start: getNewDate(ary[1]).getTime(),
            end: getNewDate(ary[2]).getTime()
          }
        })
      }
    },
    mounted() {
      this.generateLine();
    }
  }
</script>
<style>
  .task {
    fill: rgb(144, 144, 255);
  }

  .background {
    fill: #f5f5f5;
  }

  .gridline {
    stroke: rgb(253, 253, 253);
    stroke-width: 2
  }
</style>