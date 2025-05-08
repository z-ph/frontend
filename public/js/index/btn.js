let token;
try {
  token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;
} catch (e) {
  console.log(e);
  token = null;
}
const info = getFormData(form, '登录');

loginBtn.addEventListener('click', async () => {
  const postData = getFormData(form, '登录')
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
  const body = await response.json();
  if (body.code === 200) {
    console.log(body.data);
    localStorage.setItem('templatesList', JSON.stringify(body.data));
    localStorage.setItem('token', JSON.stringify(body.token));
    localStorage.setItem('userName', JSON.stringify(body.userName));
    window.location.href = 'workspace.html';
  }
  else {
    alert(body.message)
  }
});

lastLogin.addEventListener('click', e => {
  tokenLogin(token);
})

registerBtn.addEventListener('click', async () => {
  const postData = getFormData(form, '注册');
  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
  const body = await response.json();
  if (body.code === 200) {
    console.log(body.data);
    localStorage.setItem('templatesList', JSON.stringify(body.data));
    localStorage.setItem('token', JSON.stringify(body.token));
    localStorage.setItem('userName', JSON.stringify(body.userName));
    window.location.href = 'workspace.html';
  }
  else {
    alert(body.message)
  }
});

offlineBtn.addEventListener('click', () => {
  window.location.href = 'workspace.html';
});

async function tokenLogin(token) {
  try {
    if (!token) {
      alert('token失效，请重新登录');
      return;
    }
    const res = await fetch('http://localhost:3000/login/token', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token
      }),
      method: 'POST'
    })
    const body = await res.json();
    if (body.code !== 200) {
      localStorage.removeItem('token');
      alert('token失效，请重新登录');
      return;
    }
    localStorage.setItem('templatesList', JSON.stringify(body.data));
    localStorage.setItem('token', JSON.stringify(body.token));
    window.location.href = 'workspace.html';
  } catch (err) {
    console.log('无法访问服务器，检查网络或确保服务器是否正常')
  }
}
function getFormData(form, action) {
  const infoElemList = form.querySelectorAll('[name]');
  const info = { action };
  infoElemList.forEach(elem => {
    info[elem.name] = elem.value;
  });
  return info;
}