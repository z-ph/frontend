import Dragger from './toolClass/Dragger.js'
import { currentTemplateRef, componentList } from './index.js';
import doms from './doms.js';
import { saveStatus } from './doms.js';
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
  currentTemplateRef.value.appendRender(() => {
    Dragger.childrenDragable(doms.currentTemplateContainer);
  });
  saveStatus.value = false;
})
// function isOrBelongTo(element, target) {
//   while (element) {
//     if (element === target) return true;
//     element = element.parentNode;
//   }
//   return false;
// }

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
  console.log(currentTemplateRef.value.$components)
  saveStatus.value = false;
});

