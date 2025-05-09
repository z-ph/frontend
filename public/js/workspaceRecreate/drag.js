import Dragger from './toolClass/Dragger.js'
import { currentTemplateRef, componentList } from './index.js';
import doms from './doms.js';
import { saveStatus } from './doms.js';
import ModifyStyle from './ModifyStyle.js';
const workspaceDropArea = doms.currentTemplateContainer
//处理拖拽添加组件
Dragger.dropable(workspaceDropArea);
Dragger.ondrop(workspaceDropArea, () => {
  if (!currentTemplateRef.value) {
    alert('请先选择一个模板');
    return;
  }
  const acceptableFrom = [componentList.container];
  const dragging = Dragger.dragging;
  if (!acceptableFrom.includes(dragging.from)) {
    return;
  }
  const id = +dragging.node.getAttribute('data-id');
  const component = componentList.getComponent(id);
  if (!component) {
    return;
  }
  const newComponent = component.clone();
  currentTemplateRef.value.addComponent(newComponent);
  currentTemplateRef.value.appendRender((el) => {
    Dragger.childrenDragable(doms.currentTemplateContainer);
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
  saveStatus.value = false;
})


// 处理拖拽删除组件
Dragger.childrenDragable(componentList.container);
const deleteDropArea = componentList.container;
Dragger.dropable(deleteDropArea);
Dragger.ondrop(deleteDropArea, (e) => {
  const acceptableFrom = [doms.currentTemplateContainer];
  const dragging = Dragger.dragging;
  if (!acceptableFrom.includes(dragging.from)) {
    return;
  }
  currentTemplateRef.value.removeComponent(dragging.id);
  saveStatus.value = false;
});

