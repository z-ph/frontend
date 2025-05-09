class Render {
  static modify(element, newConfig = {}, callbackForEachElement = () => { }, callbackFinally = () => { }) {
    //查看后面是否有兄弟元素
    const nextElement = element.nextElementSibling;
    //如果没有则父元素appendChild
    if (!nextElement) {
      Render.append(element.parentElement, newConfig, callbackForEachElement, callbackFinally)
    }
    else {
      //如果有则在兄弟元素前面插入新元素
      Render.before(nextElement, newConfig, callbackForEachElement, callbackFinally)
    }
    element.remove();

  }
  static render(container, config = {}, callbackForEachElement = () => { }, callbackFinally = () => { }) {
    if (config.children) {
      config.children.forEach((child) => {
        const element = document.createElement(child.tag);
        if (child.classList) {
          element.classList.add(...child.classList);
        }
        if (child.dataList) {
          child.dataList.forEach((item) => {
            element.setAttribute(item.key, item.value);
          })
        }
        if (child.text) {
          element.textContent = child.text;
        }
        if (child.children) {
          Render.render(element, child, callbackForEachElement);
        }
        if (child.styleList) {
          child.styleList.forEach((style) => {
            element.style[style.key] = style.value;
          })
        }
        callbackForEachElement(element);
        container.appendChild(element);
      })
      callbackFinally();
    }
    else {
      Render.render(container, {
        children: [
          config,
        ]
      }, callbackForEachElement)
    }
  }
  static remove(container, fn, callbackForEachElement = () => { }) {
    Array.from(container.children).forEach(element => {
      if (fn(element)) {
        element.remove();
        callbackForEachElement(element);
      }
    })
  }
  static append(container, config = {}, callback = () => { }, callbackFinally = () => { }) {
    if (config.children) {
      config.children.forEach((child) => {
        const element = document.createElement(child.tag);
        if (child.classList) {
          element.classList.add(...child.classList);
        }
        if (child.dataList) {
          child.dataList.forEach((item) => {
            element.setAttribute(item.key, item.value);
          })
        }
        if (child.text) {
          element.textContent = child.text;
        }
        if (child.children) {
          Render.render(element, child, callback);
        }
        if (child.styleList) {
          child.styleList.forEach((style) => {
            element.style[style.key] = style.value;
          })
        }
        container.appendChild(element);
        callback(element);
      })
      callbackFinally();
    }
    else {
      Render.render(container, {
        children: [
          config,
        ]
      }, callback)
    }
  }
  static after(brother, config, callback = () => { }, callbackFinally = () => { }) {
    if (config.children) {
      config.children.forEach((child) => {
        const element = document.createElement(child.tag);
        if (child.classList) {
          element.classList.add(...child.classList);
        }
        if (child.dataList) {
          child.dataList.forEach((item) => {
            element.setAttribute(item.key, item.value);
          })
        }
        if (child.text) {
          element.textContent = child.text;
        }
        if (child.children) {
          Render.render(element, child, callback);
        }
        if (child.styleList) {
          child.styleList.forEach((style) => {
            element.style[style.key] = style.value;
          })
        }
        brother.after(element);
        callback(element);
      })
      callbackFinally();
    }
    else {
      Render.render(brother, {
        children: [
          config,
        ]
      }, callback)
    }
  } static before(brother, config, callback = () => { }, callbackFinally = () => { }) {
    if (config.children) {
      config.children.forEach((child) => {
        const element = document.createElement(child.tag);
        if (child.classList) {
          element.classList.add(...child.classList);
        }
        if (child.dataList) {
          child.dataList.forEach((item) => {
            element.setAttribute(item.key, item.value);
          })
        }
        if (child.text) {
          element.textContent = child.text;
        }
        if (child.children) {
          Render.render(element, child, callback);
        }
        if (child.styleList) {
          child.styleList.forEach((style) => {
            element.style[style.key] = style.value;
          })
        }
        brother.before(element);
        callback(element);
      })
      callbackFinally();
    }
    else {
      Render.render(brother, {
        children: [
          config,
        ]
      }, callback)
    }
  }
  static createContainer(config = {}) {
    if (!config.tag) return;
    const element = document.createElement(config.tag);
    if (config.classList) {
      element.classList.add(...config.classList);
    }
    if (config.dataList) {
      config.dataList.forEach(item => {
        element.setAttribute(item.key, item.value);
      })
    }
    if (config.text) {
      element.textContent = child.text;
    }
    return element;
  }
  static dataToConfig(data, callback) {
    return callback(data);
  }
  constructor(container, config = {}) {
    this.container = container;
    this.config = config;
    this.init();
  }
  init() {
    this.render(this.container, this.config);
  }
  dataToConfig(data, callback) {
    this.config = callback(data);
  }
  render(container, config = {}) {
    if (config.children) {
      config.children.forEach((child) => {
        const element = document.createElement(child.tag);
        if (child.classList) {
          element.classList.add(...child.classList);
        }
        if (child.dataList) {
          child.dataList.forEach((item) => {
            element.setAttribute(item.key, item.value);
          })
        }
        if (child.text) {
          element.textContent = child.text;
        }
        if (child.children) {
          this.render(element, child);
        }
        container.appendChild(element);
      })
    }
  }
}
const config = {
  children: [
    {
      tag: 'div',
      classList: ['card'],
      dataList: null,
      children: [
        {
          tag: 'div',
          classList: ['card-word'],
          dataList: [
            {
              key: 'data-index',
              value: '0',
            }
          ],
          text: 'hello',
          children: null,
        }
      ],
      text: '',
    }
  ]
}
const app = document.querySelector('.app');
function render(container, config = {}) {
  if (config.children) {
    config.children.forEach((child) => {
      const element = document.createElement(child.tag);
      if (child.classList) {
        element.classList.add(...child.classList);
      }
      if (child.dataList) {
        child.dataList.forEach((item) => {
          element.setAttribute(item.key, item.value);
        })
      }
      if (child.text) {
        element.textContent = child.text;
      }
      if (child.children) {
        render(element, child);
      }
      container.appendChild(element);
    })
  }
}
export default Render;