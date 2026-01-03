# 简易在线商店（中文示例）- 简洁白绿风格

这是一套**纯前端**（HTML/CSS/JS）的“简单在线商店”示例项目，UI 风格参考你提供的截图（白底 + 绿色强调 + 大圆角卡片）。

## 功能满足
- 首页（着陆页）：查看产品 / 查看购物车
- 产品列表：卡片展示（缩略图、名称、价格、简短描述、选择查看）
- 产品详情：产品 ID、长描述、加入购物车、查看更多产品
- 加入购物车后会有提示
- 购物车：修改数量 → 自动计算小计、销售税、总额
- 下单：填写账单/收货地址 → 生成确认号码 → 展示完整订单信息（复制发给商家，线下支付）
- 取消订单：清空购物车，金额重置为 0

## 响应式（手机/电脑差异）
- 顶部导航：小屏会隐藏“浏览商品”文字，仅保留按钮触达
- 产品列表：手机 1 列；电脑 2 列
- 购物车/订单明细：手机使用“商品卡片列表”；电脑使用“表格”

## 运行方式
### 方法 A：直接打开
解压后双击 `index.html`（推荐 Chrome/Edge）。

### 方法 B：本地静态服务器（更稳）
```bash
python -m http.server 8000
```
打开：
```
http://localhost:8000
```

## 自定义
- 税率：`app.js` 顶部 `TAX_RATE`
- 商品：`app.js` 里 `PRODUCTS` 数组（可增删改）


## 通知商家接口（短信/邮箱怎么做？）

### 为什么前端不能直接发短信/邮件？
短信与邮件都需要**密钥/通道**（例如短信签名、SMTP 账号、第三方 API Key），这些不应该暴露在浏览器端。
因此通常做法是：**前端把订单信息 POST 给后端**，由后端完成：
- 发送邮件（SMTP / SendGrid / 阿里云邮件等）
- 发送短信（阿里云短信 / 腾讯云短信等）
- 保存订单（数据库/表格/企业微信等）

### 本项目的对接方式
前端在下单成功时，会尝试调用：
- `POST /api/order`
- Body：订单 JSON（包含收货信息、商品明细、金额、税费、确认号码等）

你只需要在服务器实现一个接口即可。

### 示例后端（Node.js/Express）伪代码
```js
import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

app.post("/api/order", async (req, res) => {
  const order = req.body;

  // 1) 保存订单（数据库/文件/表格等）
  // 2) 发送邮件给商家（示例）
  const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: { user: "你的邮箱@qq.com", pass: "你的SMTP授权码" }
  });

  await transporter.sendMail({
    from: '"简易商店" <你的邮箱@qq.com>',
    to: order.merchantEmail || "商家默认邮箱@example.com",
    subject: `新订单：${order.orderNo}`,
    text: JSON.stringify(order, null, 2)
  });

  res.json({ ok: true });
});

app.listen(3000, ()=> console.log("API listening on 3000"));
```

### 短信推荐做法
短信同理：后端接到订单后，调用云短信服务（阿里云/腾讯云），把订单号、金额、联系电话等发给商家或买家。

> 需要我给你写一个**完整可运行的后端示例**（含邮件 + 短信二选一），告诉我你想用：  
> 1) QQ 邮箱 SMTP / 2) 阿里云邮件 / 3) SendGrid  
> 短信用：阿里云短信 or 腾讯云短信


## 去结算
- 产品详情页的“去结算”按钮会跳转到 `#/checkout`（等同于购物车页 `#/cart`）。


## 路由统一
- 本版本已将所有“购物车/去结算”入口统一到 `#/checkout`（内部仍与 `#/cart` 兼容）。


## v6 修复
- 修复顶部购物车按钮无法跳转的问题：强制将顶部购物车链接指向 `#/checkout`。


## v7 购物车布局
- 桌面端：左侧商品列表 + 右侧订单摘要（吸顶）
- 支持数量加减（− / +）、单品移除、清空购物车


## v8 调整
- 结算页移除“商家邮箱”输入框
- 增加“发给商家的订单信息”预览与一键复制（下单前即可复制）


## v9 调整
- 修复复制信息换行显示（不再把 \n 转义成文本）
- 优化订单信息格式：本地时间、人类可读、分行清晰


## v10 修复
- 修复“确认下单”无响应：改为全局事件代理处理 place-order / cancel-order 等动作，避免绑定丢失


## v11 修复
- 修复多个按钮无响应：将全局事件代理提升到顶层（并使用 capture），避免 init 未执行/重绘丢失绑定


## 本地部署（推荐）
本项目是纯前端静态站点，推荐用本地静态服务器运行，避免 `file://` 下的路由与剪贴板限制。

### 方式 1：Python（无需安装额外依赖）
在项目目录执行：
```bash
python -m http.server 8000
```
浏览器打开：
- http://localhost:8000

### 方式 2：Node（可选）
```bash
npx serve .
```

### 调试模式
在网址后加 `?debug=1` 可显示绑定与路由信息：
- http://localhost:8000/?debug=1#/checkout


## v13 修复
- 修复所有按钮无响应：v12 中 init() 未定义/启动顺序错误导致脚本报错，页面未初始化
- 现在确保 init() 存在且在文件末尾启动
