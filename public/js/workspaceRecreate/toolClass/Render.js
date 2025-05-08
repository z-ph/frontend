class Render {
  static render(container, config = {}, callback = () => { }) {
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
          Render.render(element, child);
        }
        if (child.styleList) {
          child.styleList.forEach((style) => {
            element.style[style.key] = style.value;
          })
        }
        callback(element);
        container.appendChild(element);
      })
    }
  }
  static remove(container, fn, callback = () => { }) {
    Array.from(container.children).forEach(element => {
      if (fn(element)) {
        element.remove();
        callback(element);
      }
    })
  }
  static append(container, config = {}, callback = () => { }) {
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
          Render.render(element, child);
        }
        if (child.styleList) {
          child.styleList.forEach((style) => {
            element.style[style.key] = style.value;
          })
        }
        container.appendChild(element);
        callback(element);
      })
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