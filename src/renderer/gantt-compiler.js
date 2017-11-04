const util = require("./gantt-util")

function compile(input){
  let data = input.split("\n").filter(item => item.length > 0);
  //最初の一行を除去
  data.shift();
  return data.map((item) => {
    const ary = item.split(" ");
    return {
      name: ary[0],
      start: util.getNewDate(ary[1], 0).getTime(),
      end: util.getNewDate(ary[2], 1).getTime()
    }
  })
}

function zeropad(str) {
  return ("00" + str).slice(-2)
}
function ymd(d){
  return `${d.getFullYear()}-${zeropad(d.getMonth() + 1)}-${zeropad(d.getDate())}`
}
function ymdFromEpoc(epoc, offset){
  let d = new Date(epoc)
  if(offset !== undefined){
    d.setDate(d.getDate() + offset)
  }
  return ymd(d)
}

function serialize(tasks){
  return "gantt\n" + tasks.map((item)=>{
    return `${item.name} ${ymdFromEpoc(item.start)} ${ymdFromEpoc(item.end, -1)}`
  }).join("\n") + "\n"
}

module.exports = {
  compile: compile,
  serialize: serialize
}
