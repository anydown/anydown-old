const util = require("./gantt-util")

function compile(input){
  let data = input.split("\n").filter(item => item.length > 0);
  //最初の一行を除去
  data.shift();
  return data.map((item) => {
    const ary = item.split(" ");
    return {
      name: ary[0],
      start: util.getNewDate(ary[1]).getTime(),
      end: util.getNewDate(ary[2]).getTime()
    }
  })
}

function serialize(){

}

module.exports = {
  compile: compile,
  serialize: serialize
}
