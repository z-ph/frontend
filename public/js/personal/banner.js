import Render from '../workspaceRecreate/toolClass/Render.js'
import TemplateList from '../workspaceRecreate/TemplateList.js';
const containerConfig = {
  tag: 'div',
  classList: ['container', 'card'],
}
const works = document.querySelector('#works');
const workContainer = document.querySelector('.workContainer');
const templateList = new TemplateList();
const length = templateList.$templateList.length;
let container;
let index = 0;

if (length > 0) {
  Render.append(workContainer, {
    children: [containerConfig]
  })
  container = workContainer.querySelector('.container');
  container.addEventListener('mouseenter', () => {
    clearInterval(timer);
  })
  container.addEventListener('mouseleave', () => {
    timer = setInterval(() => {
      slid();
    }, 3000);
  })
  const nextBtn = document.querySelector('.next')
  nextBtn.addEventListener('click', () => {
    slid();
  })
  var timer = setInterval(() => {
    slid();
  }, 6000);
  render(index);
}
function moveAway(container) {
  container.style.transform = 'translateX(-110%)'
}
function moveBack(container) {
  container.style.transform = 'translateX(0)'
}
function render(index) {
  container.innerHTML = ''
  templateList.render(container, index)
  container.removeEventListener('transitionend', next)
  moveBack(container);
}

function next() {
  if (index < length - 1) {
    index++;
  }
  else {
    index = 0;
  }
  render(index);
}
function slid() {
  moveAway(container);
  container.addEventListener('transitionend', next)
}
