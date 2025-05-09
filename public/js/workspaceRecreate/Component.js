import Render from './toolClass/Render.js'
class Component {
  static type = {
    input: 1,
    button: 2,
    date: 3,
    select: 4,
    radio: 5,
  }
  static ObjectToComponent(data) {
    let component;
    +data.type === Component.type.input && (component = new Input(data));
    + data.type === Component.type.button && (component = new Button(data));
    + data.type === Component.type.select && (component = new Select(data));
    + data.type === Component.type.date && (component = new Mydate(data));
    +data.type === Component.type.radio && (component = new Radio(data));
    return component;
  }
  constructor(config = {}) {
    // config = { id, cardWidth, cardHeight, cardBorderRadius, title, disabled }
    Object.assign(this, config)
  }
  // 获取可改变的属性
  get modifyComponentInfo() {
    return {
      id: this.id,
      cardWidth: this.cardWidth,
      cardHeight: this.cardHeight,
      cardBorderRadius: this.cardBorderRadius,
      title: this.title,
    }
  }

  clone() {
    return new this.constructor(this)
  }
  remove(container, fn) {
    Render.remove(container, fn)
  }
  get cardConfig() {
    return {
      tag: 'div',
      classList: ['card', 'single-component-container'],
      dataList: [
        { key: 'data-id', value: this.id }
      ]
    }
  }
  get titleConfig() {
    return {
      tag: 'h3',
      text: this.title,
      classList: ['title'],
    }
  }
  appendRender(container, callback = () => { }) {
    const config = {
      children: [
        this.config,
      ]
    }
    Render.append(container, config, callback);
  }
}
class Input extends Component {
  constructor(config = {}) {
    // config = { id, cardWidth, cardHeight, cardBorderRadius, title, disabled, placeholder, name, inputWidth, inputHeight, inputBorderRadius, inputBorder, autoComplete }
    super(config);
    Object.assign(this, config)
  }
  get modifyComponentInfo() {
    return {
      ...super.modifyComponentInfo,
      placeholder: this.placeholder,
      name: this.name,
      inputWidth: this.inputWidth,
      inputHeight: this.inputHeight,
      inputBorderRadius: this.inputBorderRadius,
      inputBorder: this.inputBorder,
      autoComplete: this.autoComplete,
    }
  }
  get config() {
    return {
      ...this.cardConfig,
      children: [
        this.titleConfig,
        {
          tag: 'input',
          text: null,
          classList: null,
          dataList: [
            {
              key: 'placeholder',
              value: this.placeholder,
            },
            {
              key: 'name',
              value: this.name,
            }
          ],
          styleList: [
            {
              key: 'width',
              value: this.inputWidth,
            },
            {
              key: 'height',
              value: this.inputHeight,
            },
            {
              key: 'borderRadius',
              value: this.inputBorderRadius,
            },
            {
              key: 'border',
              value: this.inputBorder,
            }
          ],
          children: null,
        }
      ]
    }
  }
}
class Button extends Component {
  constructor(config = {}) {
    // config = { id, cardWidth, cardHeight, cardBorderRadius, title, disabled, buttonText, buttonWidth, buttonHeight, buttonBorderRadius, buttonBorder, buttonBackgroundColor, buttonColor }
    super(config);
    Object.assign(this, config)
  }
  get config() {
    return {
      ...this.cardConfig,
      children: [
        this.titleConfig,
        {
          tag: 'button',
          text: this.buttonText,
          dataList: [
            {
              key: 'type',
              value: 'button',
            },
          ],
          styleList: [
            {
              key: 'width',
              value: this.buttonWidth,
            },
            {
              key: 'height',
              value: this.buttonHeight,
            },
            {
              key: 'borderRadius',
              value: this.buttonBorderRadius,
            },
            {
              key: 'border',
              value: this.buttonBorder,
            },
            {
              key: 'backgroundColor',
              value: this.buttonBackgroundColor,
            },
            {
              key: 'color',
              value: this.buttonColor,
            },

          ],
        }
      ]
    }
  }
}
class Select extends Component {
  constructor(config = {}) {
    // config = { id, cardWidth, cardHeight, cardBorderRadius, title, disabled, selectOptions, selectWidth, selectHeight, name }
    super(config);
    Object.assign(this, config)
  }
  get config() {
    return {
      ...this.cardConfig,
      children: [
        this.titleConfig,
        {
          tag: 'select',
          text: null,
          dataList: [
            { key: 'name', value: this.name },
          ],
          styleList: [
            { key: 'width', value: this.selectWidth },
            { key: 'height', value: this.selectHeight },
          ],
          children: this.selectOptions.map(option => {
            return {
              tag: 'option',
              text: option.text,
              dataList: [
                { key: 'value', value: option.value },
              ],
            }
          })
        }
      ]
    }
  }
}
class Mydate extends Component {
  constructor(config = {}) {
    // config = { id, cardWidth, cardHeight, cardBorderRadius, title, disabled, date, dateWidth, dateHeight, name }
    super(config);
    Object.assign(this, config)
  }
  get config() {
    return {
      ...this.cardConfig,
      children: [
        this.titleConfig,
        {
          tag: 'input',
          text: null,
          dataList: [
            { key: 'type', value: 'date' },
            { key: 'name', value: this.name },
          ],
          styleList: [
            { key: 'width', value: this.dateWidth },
            { key: 'height', value: this.dateHeight },
          ]
        },
      ]
    }
  }
}

export { Component, Input, Button, Select, Mydate }