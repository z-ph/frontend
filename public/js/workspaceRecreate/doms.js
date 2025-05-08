// 页面中的dom元素以及数据渲染dom元素的方法
const doms = {}
doms.componentLibrary = document.querySelector('.component-library')
doms.componentLibraryContainer = document.querySelector('.component-library .container')

doms.templatesLibrary = document.querySelector('.templates-libaray')
doms.templatesLibraryContainer = document.querySelector('.templates-libaray .container')
doms.currentTemplate = document.querySelector('.current-template')
doms.currentTemplateContainer = document.querySelector('.current-template .container')
doms.addNewTemplate = document.querySelector('.add-new-template')

doms.deleteCurrentTemplate = document.querySelector('.delete-current-template')

doms.save = document.querySelector('.save')
doms.test = document.querySelector('button.test')
doms.restore = document.querySelector('button.restore')

function changeSaveBtn(saved) {
  const $span = doms.save.querySelector('span')
  let span;
  if (!$span) {
    span = document.createElement('span');
    doms.save.appendChild(span);
  }
  else {
    span = $span
  }
  span.style.fontSize = '0.6em'
  if (saved) {
    span.innerText = '(已保存)'
  }
  else {
    span.innerText = '(未保存)'
  }
}
function listen(data, callback = () => { }) {
  if (!(data instanceof Object) || data === null) {
    const obj = { value: data }
    return new Proxy(obj, {
      set(target, key, value) {
        if (key === 'value') {
          target[key] = value;
          callback(value);
          return true;
        }
      }
    })
  }
  return new Proxy(data, {
    set(target, key, value) {
      target[key] = value;
      callback(value);
      return true;
    }
  })
}
const saveStatus = listen(false, changeSaveBtn);
export default doms;
export { saveStatus };