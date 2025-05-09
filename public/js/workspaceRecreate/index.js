import { Input, Button, Select, Mydate, Component } from './Component.js';
import doms from './doms.js';
import { saveStatus } from './doms.js';
import ComponentList from './ComponentList.js';
import TemplateList from './TemplateList.js';
import ModifyStyle from './ModifyStyle.js';
import Render from './toolClass/Render.js';
const init = {}

init.input = new Input({
  type: Component.type.input, id: 0, cardWidth: 'auto', cardHeight: 'auto', cardBorderRadius: '0', title: '姓名', disabled: true, placeholder: '请输入姓名', name: 'name', inputWidth: '100%', inputHeight: 'auto', inputBorderRadius: '0', inputBorder: '1px solid #000', name: 'name', autoComplete: 'off'
});

init.button = new Button({ type: Component.type.button, id: 1, cardWidth: 'auto', cardHeight: 'auto', cardBorderRadius: '0', title: '按钮', disabled: false, buttonText: '按钮', buttonWidth: 'auto', buttonHeight: 'auto', buttonBorderRadius: '0', buttonBorder: '1px solid #000', buttonBackgroundColor: '#fff', buttonColor: '#000' })
init.select = new Select({
  type: Component.type.select,
  id: 2, cardWidth: 'auto',
  cardHeight: 'auto', name: '爱好', cardBorderRadius: '0', title: '爱好', disabled: false, selectOptions: [
    { text: '选项1', value: '1' },
    { text: '选项2', value: '2' }
  ],
  selectWidth: 'auto', selectHeight: 'auto'
})
init.date = new Mydate({ type: Component.type.date, id: 3, cardWidth: 'auto', cardHeight: 'auto', cardBorderRadius: '0', title: '日期', disabled: false, date: '2023-01-01', dateWidth: 'auto', dateHeight: 'auto', name: 'date' })


//
let componentList, currentTemplateRef;
componentList = new ComponentList(doms.componentLibraryContainer)
currentTemplateRef = {
  value: null,
};
function isOrBelongTo(element, target) {
  while (element) {
    if (element === target) return true;
    element = element.parentNode;
  }
  return false;
}

//
let templateList;
templateList = new TemplateList(doms.templatesLibraryContainer, currentTemplateRef, (el) => {
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
})
componentList.addComponent(init.input)
componentList.addComponent(init.select)
componentList.addComponent(init.date)
componentList.addComponent(init.button)
componentList.render()
templateList.renderListName();


//
doms.addNewTemplate.onclick = () => {
  const name = prompt('请输入模板名称');
  if (!name) {
    return;
  }
  templateList.addTemplate(name);
  templateList.renderListName();
}
doms.deleteCurrentTemplate.onclick = () => {
  templateList.removeSelectedTemplate();
}
doms.save.addEventListener('click', () => {
  templateList.saveToLocalStorage();
  saveStatus.value = true;
  const url = `http://localhost:5000`;
  const data = JSON.parse(localStorage.getItem('templateList'));

  try {
    //上传数据
    fetch(`${url}/update-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data
      })
    }).catch(err => {
      console.log(err);
    });
    //刷新token
    fetch(`${url}/refresh-token`, {
      method: 'POST'
    }).then(res => res.json())
      .then(data => {
        if (data) {
          if (!data.ok) {
            alert('请重新登陆');
            location.href = '/login'
          }
        }
      }).catch(err => {
        console.log(err);
      });
  } catch (err) {
    console.log('无法访问服务器，检查网络或确保服务器是否正常');
  }
})
const autoSave = setInterval(() => {
  doms.save.click();
}, 10000);



export { currentTemplateRef, componentList }