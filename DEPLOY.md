# 发布和在线回执

## 1. 配置在线回执

当前页面已经支持通过静态表单服务在线提交回执，接收邮箱已配置为 `3133441979@qq.com`。当前 endpoint 是：

```js
rsvpEndpoint: "https://formsubmit.co/ajax/3133441979@qq.com",
```

使用的是 FormSubmit：

1. 准备一个接收回执的邮箱。
2. 如果后续要换邮箱，把 `app.js` 顶部 `weddingConfig.rsvpEndpoint` 改成：

   ```js
   rsvpEndpoint: "https://formsubmit.co/ajax/你的邮箱@example.com",
   ```

3. 部署后先自己提交一次测试回执，FormSubmit 会给 `3133441979@qq.com` 发一封激活邮件。
4. 点激活后，后续宾客提交的回执会以邮件形式发到该邮箱。

也可以运行脚本自动改：

```powershell
.\scripts\set-release-config.ps1 -PublicUrl "https://你的GitHub用户名.github.io/仓库名/" -RsvpEmail "你的邮箱@example.com"
```

## 2. 部署到 GitHub Pages

这个目录本身就是一个完整的静态站。推荐新建一个单独仓库，例如 `wedding-invitation`：

1. 在 GitHub 创建仓库。
2. 把 `wedding-h5` 目录里的所有文件上传到仓库根目录，包含 `.github/workflows/pages.yml`。
3. 到仓库 `Settings -> Pages`，Source 选择 `GitHub Actions`。
4. 推送到 `main` 分支后，Actions 会自动发布。
5. 发布完成后，你会得到形如：

   ```text
   https://你的GitHub用户名.github.io/wedding-invitation/
   ```

6. 得到正式地址后运行：

   ```powershell
   .\scripts\set-release-config.ps1 -PublicUrl "https://你的GitHub用户名.github.io/wedding-invitation/" -RsvpEmail "你的邮箱@example.com"
   ```

7. 再提交并推送一次，让 QQ/微信抓到绝对缩略图地址。

## 3. 像聊天卡片一样发送

页面已经加了 `og:title`、`og:description`、`og:image`、`itemprop` 和 `image_src`。部署后把 GitHub Pages 地址发到 QQ/微信，通常会显示成“标题 + 描述 + 缩略图”的卡片。

如果某个聊天软件只显示普通链接，可以：

- 等几分钟再发，平台抓图有缓存。
- 确认 `og:image` 已经是 `https://.../assets/share-card.jpg` 这样的绝对地址。
- 先在浏览器打开一次正式链接，再复制地址发送。
