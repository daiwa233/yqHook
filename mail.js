const nodemailer  = require('nodemailer');
const { mailerConfig } = require('./key');
const { email, sender } = require('./config')
let transporter = nodemailer.createTransport(mailerConfig);
const map = {
  update: '更新至vuepress',
  publish: '发布至vuepress',
  build: '通过vuepress构建',
  nginx: '重启nginx'
}
module.exports = (title, status, message = false) => {
  let htmlStr;
  if(status === 'comment') {
    // 评论通知
  } else {
    htmlStr = message 
    ? `<p>《${title}》在${map[status]}时出错</p>
    <p>堆栈信息：${message}</p>`
    : `<p>《${title}》已成功通过yqHook${map[status]}到vuepress上，请检查</p>`;
  }
  
  const mailOptions = {
    from: sender,
    to: email,
    subject: '来自yqHook的通知',
    html: htmlStr
  }
  return new Promise(function(resolve, reject) {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      }
      resolve(info);
    })
  })
}
