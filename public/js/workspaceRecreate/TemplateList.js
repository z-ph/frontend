import ComponentList from "./ComponentList.js";
import Render from './toolClass/Render.js'
import doms, { saveStatus } from "./doms.js";
// import ModifyStyle from "./ModifyStyle.js";
class TemplateList {
  constructor(container, currentTemplateRef, renderCallback) {
    this.$templateList = this.localStorageToTemplateList(localStorage.getItem('templateList')) || [];
    // this.$templateList = [];
    this.renderCallback = renderCallback;
    this.container = container;
    //回收站
    this.recycleBin = [];
    // this.renderListName();
    this.currentTemplateRef = currentTemplateRef;
  }
  render(container, id) {
    this.$templateList.at(id).componentList.container = container;
    this.$templateList.at(id).componentList.render();
  }
  addTemplate(name) {
    const componentList = new ComponentList(doms.currentTemplateContainer);
    this.$templateList.push({
      name,
      componentList,
      removed: false
    })
  }
  renderListName(callback = () => { }) {
    this.container.innerHTML = '';
    this.$templateList.forEach((template, index) => {
      const renderConfig = {
        children: [
          {
            tag: 'div',
            text: template.name,
            classList: ['template-name', 'hover-flow'],
            dataList: [
              {
                key: 'data-id',
                value: index
              }
            ]
          }
        ]
      }
      Render.append(this.container, renderConfig)
    });
    this.listNameElArray.forEach(el => {
      el.onclick = () => {
        this.selectTemplate(+el.dataset.id)
      }
    });
    callback && callback()
  }
  get listNameElArray() {
    return Array.from(doms.templatesLibraryContainer.querySelectorAll('.template-name'));
  }
  selectTemplate(id) {
    if (!this.$templateList.at(id)) {
      this.currentTemplateRef.value = new ComponentList(doms.currentTemplateContainer);
      this.currentTemplateRef.value.render(this.renderCallback);
      return;
    }
    //取出所有selected类
    const selectedElArray = Array.from(doms.templatesLibraryContainer.querySelectorAll('.selected'));
    selectedElArray.forEach(el => el.classList.remove('selected'));
    //1.找到对应的componentList
    const componentList = this.$templateList.at(id).componentList;
    //给指定index的添加selected类
    const index = this.$templateList.findIndex(template => template.componentList === componentList);
    doms.templatesLibraryContainer.querySelector(`[data-id="${index}"]`).classList.add('selected');
    //在当前模板中渲染出模板
    this.currentTemplateRef.value = componentList;
    this.currentTemplateRef.value.render(this.renderCallback);
  }
  removeSelectedTemplate() {
    const selectedElArray = Array.from(doms.templatesLibraryContainer.querySelectorAll('.selected'));
    if (selectedElArray.length === 0) {
      alert('请选择一个模板');
      return;
    }
    const id = +selectedElArray[0].dataset.id;
    this.$templateList[id].removed = true;
    //移入回收站
    this.recycleBin = this.$templateList.filter(template => template.removed)
    this.$templateList = this.$templateList.filter((template) => !template.removed)
    this.renderListName();
    this.selectTemplate(id - 1);
  }
  localStorageToTemplateList(data) {
    if (!(data instanceof Object)) {
      data = JSON.parse(data);
    }
    if (!data) {
      return null;
    }
    if (!Object.keys(data).includes('$templateList')) {
      return null;
    }
    const result = data.$templateList.map(templateData => {
      const componentList = ComponentList.localStoreToComponentList(doms.currentTemplateContainer, templateData.componentList)
      return {
        name: templateData.name,
        componentList: componentList,
        removed: templateData.removed
      }
    })
    return result;
  }
  saveToLocalStorage() {
    localStorage.setItem('templateList', JSON.stringify(this));
  }
  renderRecycleBinNameList(callback = () => { }) {
    this.recycleBin.forEach((template, index) => {

      const renderConfig = {
        children: [
          {
            tag: 'div',
            text: template.name,
            classList: ['template-name', 'hover-flow', 'removed'],
            dataList: [
              {
                key: 'data-id',
                value: index + this.$templateList.length,
              }
            ]
          }
        ]
      }
      Render.append(this.container, renderConfig)
    });
    this.listNameElArray.forEach(el => {
      el.onclick = () => {
        this.selectTemplate(+el.dataset.index)
      }
    });
    callback && callback()
  }
  restoreTemplate(index) {
    this.recycleBin[index].removed = false;
    this.$templateList.push(this.recycleBin[index]);
    this.recycleBin = this.recycleBin.filter(template => !template.removed)
    this.renderListName();
  }
}
export default TemplateList;