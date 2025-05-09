import Render from "./toolClass/Render.js";
import { Component } from "./Component.js";
import { saveStatus } from "./doms.js";
class ModifyStyle {
  static dialogConfig = {
    children: [
      {
        tag: 'div',
        classList: ['modify-style'],
        children: [
          {
            tag: 'div',
            classList: ['dialog-controller'],
            children: [
              {
                tag: 'button',
                classList: ['dialog-controller-save'],
                text: '保存'
              },
              {
                tag: 'button',
                classList: ['dialog-controller-cancel'],
                text: '取消'
              },
            ]
          },
          {
            tag: 'div',
            classList: ['input-group'],
            flag: true,
          }
        ]
      },
    ]
  }
  static findFlag(config) {
    if (config.flag) {
      return config;
    } else {
      if (!config.children) {
        return;
      }
      for (let i = 0; i < config.children.length; i++) {
        const child = config.children[i];
        const result = ModifyStyle.findFlag(child);
        if (result) {
          return result;
        }
      }
    }
  }
  static getDialog(inputGroupConfig) {
    const inputGroup = ModifyStyle.findFlag(ModifyStyle.dialogConfig);
    inputGroup.children = inputGroupConfig;
    return ModifyStyle.dialogConfig;
  }
  static transform(component) {
    const inputGroupConfig = [];
    for (const key in component) {
      let value = component[key];
      if (value instanceof Function) {
        continue;
      }
      if (value instanceof Object) {
        value = JSON.stringify(value);
      }

      let inputConfig = {
        tag: 'div',
        classList: ['input-container'],
        children: [
          {
            tag: 'label',
            text: key,
            classList: ['input-label'],
          },
          {
            tag: 'input',
            classList: ['input'],
            dataList: [
              {
                key: 'type',
                value: 'text'
              },
              {
                key: 'value',
                value: value
              }
            ]
          }
        ]
      }
      if (key === 'type' || key === 'id') {
        inputConfig = {
          tag: 'div',
          classList: ['input-container'],
          children: [
            {
              tag: 'label',
              text: key,
              classList: ['input-label'],
            },
            {
              tag: 'input',
              classList: ['input'],
              dataList: [
                {
                  key: 'type',
                  value: 'text'
                },
                {
                  key: 'value',
                  value: value
                },
                {
                  key: 'disabled',
                  value: 'disabled'
                }
              ]
            }
          ]
        }
      }
      inputGroupConfig.push(inputConfig);
    }
    console.log(inputGroupConfig);
    return inputGroupConfig;
  }
  static dialogNode = null;
  static getDialogData() {
    const inputGroupList = ModifyStyle.dialogNode.querySelectorAll('.input-container');
    const inputGroupArray = Array.from(inputGroupList)
    const componentData = inputGroupArray.map(group => {
      const key = group.children[0].textContent;
      let value = group.children[1].value;
      try {
        if (JSON.parse(value) instanceof Object) {
          value = JSON.parse(value);
        }
      } catch (e) {
        value = value;
      }
      return {
        key: key,
        value: value
      }
    })
    const objForm = componentData.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {})
    return objForm;
  }
  static showDialog(component, currentTemplateRef) {
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);
    dialog.showModal();
    ModifyStyle.dialogNode = dialog;
    const inputGroupConfig = ModifyStyle.transform(component);
    const $dialogConfig = ModifyStyle.getDialog(inputGroupConfig);
    Render.render(dialog, $dialogConfig, (el) => {
      if (el.classList.contains('dialog-controller-save')) {
        el.onclick = () => {
          dialog.remove();
          const node = ModifyStyle.clickNode;
          const id = +node.getAttribute('data-id');
          const newComponentData = ModifyStyle.getDialogData();
          const newComponent = Component.ObjectToComponent(newComponentData);
          const newConfig = newComponent.config;
          Render.modify(node, {
            children: [newConfig],
          }, (el) => {
            if (el.classList.contains('single-component-container')) {
              el.onclick = (e) => {
                if (!e.target.classList.contains('single-component-container')) {
                  return;
                }
                ModifyStyle.clickNode = e.currentTarget;
                const index = +el.getAttribute('data-id');
                const component = currentTemplateRef.value.getComponent(index);
                ModifyStyle.showDialog(component, currentTemplateRef);
                saveStatus.value = false;
              }
            }
          });
          currentTemplateRef.value.remove(id);
          currentTemplateRef.value.add(newComponent);
          // currentTemplateRef.value.appendRender();
        }
      }
      if (el.classList.contains('dialog-controller-cancel')) {
        el.onclick = () => {
          dialog.remove();
        }
      }
    });
  }
  constructor(component) {
    this.inputGroupConfig = ModifyStyle.transform(component);
    this.dialog = document.createElement('dialog');
    Render.render(this.dialog, ModifyStyle.getDialog(this.inputGroupConfig));
  }
  showDialog() {
    this.dialog.showModal();
  }
  save() {
    this.dialog.querySelector('.dialog-controller-save').onclick = () => {

    }
  }
  cancel() {
    this.dialog.querySelector('.dialog-controller-cancel').onclick = () => {
      this.dialog.close();
    }
  }
  static clickNode = null;
}
export default ModifyStyle;