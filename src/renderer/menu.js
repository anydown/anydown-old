import { remote } from "electron"
const { Menu } = remote.require("electron")

export default {
  menubar: [],
  newFile() { },
  openFile() { },
  saveFile() { },
  saveAsFile() { },
  ready() {
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