import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Users } from './src/js/Users.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
// 在中间件配置部分添加
const app = express();
const port = 5000;
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const oneDay = 24 * 60 * 60 * 1000;
const dataPath = './src/json/user.json'
const users = new Users(dataPath);
users.fetch();
const secretKey = 'secret';

// 创建验证Token的中间件
const verifyToken = (req, res, next) => {
  const token = req.cookies ? req.cookies.token : null;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      return res.redirect('/login');
    }
    // req.user = decoded; // 将解码后的用户信息附加到请求对象上
    res.locals.user = decoded;
    next();
  } catch (error) {
    return res.redirect('/login');
  }
};

// 首页
app.get('/', verifyToken, (req, res) => {
  res.sendFile('index.html', { root: 'src/html' });
});

// 登陆注册页面
app.get('/login', (req, res) => {
  // 发送登陆页面
  res.sendFile('login.html', { root: 'src/html' });
});

app.get('/logout', (req, res) => {
  // 清除token
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.redirect('/login');
});

// 工作区页
app.get('/workspace', verifyToken, (req, res) => {
  res.sendFile('workspace.html', { root: 'src/html' });
});

// 个人中心页
app.get('/personal', verifyToken, (req, res) => {
  res.sendFile('personal.html', { root: 'src/html' });
});

// 登录接口
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '2d' });
    const refreshToken = jwt.sign({ username }, secretKey, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: oneDay });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: oneDay * 7 });
    // 如果通过验证，重定向到首页
    res.redirect('/');
    return;
  }
  res.json({
    message: '用户或密码错误',
    ok: false
  });
});

//获取当前用户信息的接口
app.get('/get-user-info', verifyToken, (req, res) => {
  const username = res.locals.user.username;
  const userInfo = users.find(user => user.username === username);
  res.json({
    username: userInfo.username,
    avatarUrl: userInfo.avatarUrl,
    data: userInfo.data
  });
})

// 注册接口
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (user) {
    res.json({ message: 'User already exists', ok: false });
    return;
  }
  const data = [];
  users.push({ username, password, data });
  const token = jwt.sign({ username }, secretKey, { expiresIn: '2d' });
  const refreshToken = jwt.sign({ username }, secretKey, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, maxAge: oneDay });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: oneDay * 7 });
  // 如果注册成功，重定向到首页
  res.redirect('/');
});

// 刷新token接口
app.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, secretKey);
      const newToken = jwt.sign({ username: decoded.username }, secretKey, { expiresIn: '2d' });
      res.clearCookie('token');
      res.cookie('token', newToken, { httpOnly: true, maxAge: oneDay });
    }
    catch (e) {
      return res.status(401).json({ ok: false, message: '无效或过期的 refreshToken' });
    }

  } else {
    res.redirect('/login');
  }
});

function uploadAvatar(req, res, next) {
  // 验证 JWT
  const token = req.cookies ? req.cookies.token : null;
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const user = {};
  try {
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      return res.status(401).json({ success: false, message: '无效的 token' });
    }
    user.username = decoded.username;
  } catch (error) {
    return res.status(401).json({ success: false, message: '无效的 token' });
  }

  // 配置 multer
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/pic/avatars/')  // 文件存储路径
    },
    filename: function (req, file, cb) {
      // cb(null, `${user.username}.${file.originalname.split('.')[1]}`)  // 生成唯一文件名
      cb(null, `${user.username}`)  // 生成唯一文件名
    }
  });
  res.locals.user = user;
  const upload = multer({ storage: storage });
  upload.single('avatar')(req, res, next);
}

// 上传头像接口
app.post('/upload-avatar', uploadAvatar, (req, res) => {
  const user = res.locals.user;
  if (!req.file) {
    return res.status(400).json({ success: false, message: '未选择文件' });
  }
  const avatarUrl = `/pic/avatars/${req.file.filename}`;
  res.json({ success: true, avatarUrl });
});
//上传数据
app.post('/update-data', verifyToken, (req, res) => {
  const username = res.locals.user.username;
  users.update(username, req.body.data);
})
//修改密码接口
app.post('/modify-password', verifyToken, (req, res) => {
  const username = res.locals.user.username;
  const password = req.body.password;
  users.modifyPassword(username, password);
  const newToken = jwt.sign({ username }, secretKey, { expiresIn: '2d' });
  const refreshToken = jwt.sign({ username }, secretKey, { expiresIn: '7d' });
  res.cookie('token', newToken, { httpOnly: true, maxAge: oneDay });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: oneDay * 7 });
  res.json({ ok: true });
})
//启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});