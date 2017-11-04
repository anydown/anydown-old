//Examples

const kanbanExample = `\`\`\`kanban
# TODO
* Task 1
* Task 2
* Task 3
# DOING
# DONE
\`\`\`
`

function zeropad(str) {
  return ("00" + str).slice(-2)
}

const d = new Date();
const exampleTask1 = `${d.getFullYear()}-${zeropad(d.getMonth() + 1)}-${zeropad(d.getDate())}`
d.setDate(d.getDate() + 3);
const exampleTask2 = `${d.getFullYear()}-${zeropad(d.getMonth() + 1)}-${zeropad(d.getDate())}`
d.setDate(d.getDate() + 3);
const exampleTask3 = `${d.getFullYear()}-${zeropad(d.getMonth() + 1)}-${zeropad(d.getDate())}`

const ganttExample = `\`\`\`gantt
Task1 ${exampleTask1} ${exampleTask2}
Task2 ${exampleTask2} ${exampleTask3}
\`\`\`
`


export default {
  menubar: [],
  newFile() { },
  openFile() { },
  saveFile() { },
  saveAsFile() { },
  ready($electron) {
    let remote
    let Menu
    if ($electron) {
      remote = $electron.remote
      Menu = remote.Menu;
    }

    var self = this;
    this.menubar.push({
      label: "ファイル",
      submenu: [
        {
          label: "新規作成",
          accelerator: "CmdOrCtrl+N",
          click() {
            self.newFile()
          }
        },
        {
          label: "開く",
          accelerator: "CmdOrCtrl+O",
          click() {
            self.openFile()
          }
        },
        {
          label: "保存",
          accelerator: "CmdOrCtrl+S",
          click() {
            self.saveFile()
          }
        },
        {
          label: "名前を付けて保存",
          accelerator: "CmdOrCtrl+Shift+S",
          click() {
            self.saveAsFile()
          }
        },
      ],
    }, {
        label: "挿入",
        submenu: [
          {
            label: "カンバン",
            click() {
              self.insert(kanbanExample)
            }
          },
          {
            label: "ガントチャート",
            click() {
              self.insert(ganttExample)
            }
          },
        ],
      },
      {
        label: "ヘルプ",
        submenu: [
          {
            label: "GitHub",
            click() {
              remote.shell.openExternal("https://github.com/anydown/anydown")
            }
          },
          {
            label: "問題の報告",
            click() {
              remote.shell.openExternal("https://github.com/anydown/anydown/issues")
            }
          },
        ]
      })
    Menu.setApplicationMenu(
      Menu.buildFromTemplate(this.menubar)
    )
  }
}