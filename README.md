# 像素游戏风婚礼邀请函

这是根据视频参考重做的一版竖屏 H5 请柬：亮色草地、木牌标题、Q 版新人、木质信息框、相册框、行程木条和地址导航，整体更接近“像素游戏 UI”的观感。

## 如何修改信息

打开 `app.js`，修改顶部的 `weddingConfig`：

- `groomName` / `brideName`：新人姓名
- `dateISO` / `displayDate`：婚礼时间
- `lunarDate`：农历或星期信息
- `venueName` / `venueAddress` / `mapUrl`：地点和导航链接
- `invitationText` / `closingLine`：邀请正文
- `photos`：真实照片路径、说明文案和横竖版式
- `schedule`：婚礼流程
- `closingTitle` / `closingText`：结尾文字

## 素材说明

`assets/pixel-game-wedding-bg.png` 是原创生成的像素游戏风背景底图，`assets/pixel-game-wedding-bg-custom.png` 是根据真人婚纱照替换顶部像素新人的当前使用版本。`assets/photos/` 中是从旧请柬数据源整理出的照片，`assets/map-snapshot.jpg` 是旧请柬里的地址地图截图。页面里的文字、木牌和表单由 HTML/CSS 渲染，方便后续继续调整。

## 功能

- 手机端优先的竖屏长卷轴
- 婚礼倒计时
- 相册区
- 行程表
- 地图导航与复制地址
- 分享链接
- 下载日历 `.ics`
- 在线回执表单

回执表单已经支持在线提交。部署前把 `app.js` 里的 `rsvpEndpoint` 配置成表单服务地址；GitHub Pages 发布步骤见 `DEPLOY.md`。
