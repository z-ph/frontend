import Render from './toolClass/Render.js';
import Dragger from './toolClass/Dragger.js';
import { Component, Input, Button, Mydate, Select } from './Component.js';
class ComponentList {
  static localStoreToComponentList(container, data) {
    const componentList = new ComponentList(container);
    data.$components.forEach(componentData => {
      const component = Component.ObjectToComponent(componentData)
      componentList.addComponent(component)
    })
    return componentList;
  }
  constructor(container) {
    this.$components = [];
    this.container = container;
    this.unrenderedComponentList = [];
    this.$id = 0;
  }
  addComponent(component) {
    const cloneComponent = component.clone()
    cloneComponent.id = this.$id;
    this.$id++;
    this.$components.push(cloneComponent);
    this.unrenderedComponentList.push(cloneComponent);
    // this.updateId();
  }
  add(component) {
    const cloneComponent = component.clone()
    this.$components.push(cloneComponent);
    this.$components.sort((a, b) => +a.id - +b.id)
  }
  remove(id) {
    this.$components = this.$components.filter(component => +component.id !== +id)
  }
  removeComponent(id) {
    this.removeItem = this.$components.find(component => +component.id === +id)
    this.$components = this.$components.filter(component => +component.id !== +id)
    if (!this.removeItem) {
      return;
    }
    this.removeItem.remove(this.container, (el) => {
      const dataIndex = +el.getAttribute('data-id')
      if (dataIndex === +id) {
        return true;
      }
      return false;
    })
    // this.updateId();
  }
  exchangeComponent(id1, id2) {
    const index1 = this.$components.findIndex(component => +component.id === +id1)
    const index2 = this.$components.findIndex(component => +component.id === +id2)
    const temp = this.$components[index1]
    this.$components[index1] = this.$components[index2]
    this.$components[index2] = temp
    this.container.innerHTML = ''
    Render.render(this.container, this.config)
  }
  getComponent(id) {
    return this.$components.find(component => +component.id === +id)
  }
  updateId() {
    this.$components.forEach((component, index) => {
      component.id = index;
    })
  }
  modifyComponentInfo(id, info) {
    const component = this.getComponent(+id)
    Object.assign(component, info)
  }
  get config() {
    return {
      children: this.$components.sort((a, b) => +a.id - +b.id).map(component => {
        return component.config
      })
    }
  }
  render(callbackForEachElement = () => { }) {
    this.container.innerHTML = '';
    Render.render(this.container, this.config, callbackForEachElement)
    this.unrenderedComponentList = [];
    Dragger.childrenDragable(this.container);
  }
  appendRender(callback = () => { }) {
    this.unrenderedComponentList.forEach(component => {
      component.appendRender(this.container, callback);
    })
    this.unrenderedComponentList = [];
  }
}
export default ComponentList;