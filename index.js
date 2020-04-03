const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const { addFontMatter } = require('./util');
const { execSync } = require('child_process');
const { Rootpath } = require('./config');
const path = require('path');
const mailer = require('./mail');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.post('/new', function(req, res) {
  const { body } = req;
  console.log(body)
  console.log('123')
})
app.post('/update', function(req, res) {
  const { body } = req;
  // console.log(body)
  const { title, slug, body:contentDraft } = body.data,
        { name, created_at } = body.data.book,
        { name: author } = body.data.user;
  const content = addFontMatter({
    title, 
    contentDraft, 
    name, 
    created_at, 
    author
  });
  fs.writeFile(path.resolve(Rootpath, `${slug}.md`), content, function(err) {
    if(err) {
      // 发送邮件，提示转存失败
      mailer(title, 'update', err.message)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        // 日志记录
        console.log(err)
      })
      return;
    }
    // 没有问题就调用shell命令使用vuepress打包
    try {
      execSync('npm run docs:build')
    } catch(err){
      // 打包时出现错误,发送邮件
      mailer(title, 'build', err.message)
      .catch(err => {
        // 日志记录发送邮件错误
        console.log(err)
      })
      // 日志记录调用shell错误
      console.log(err)
      return;
    }
    // 调用shell命令重启nginx
    try{
      execSync('/usr/local/nginx/sbin/nginx -s reload')
    } catch(err){
       // 打包时出现错误,发送邮件
       mailer(title, 'nginx', err.message)
       .catch(err => {
         // 日志记录发送邮件错误
         console.log(err)
       })
       // 日志记录调用shell错误
       console.log(err)
       return;
    }
    // 最后发送邮件通知，成功
    mailer(title, 'update')
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      // 日志记录
      console.log(err)
    })
  })
})

app.post('/comment', function(req, res) {
  const { body } = req;
  // console.log(body)
})
app.listen(PORT, () => console.log(`server is running at ${PORT}`))



