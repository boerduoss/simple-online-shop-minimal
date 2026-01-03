/* 简易在线商店（中文） - 修正版
   纯前端（HTML/CSS/JS），使用 hash 路由与 localStorage 保存购物车
*/
'use strict';

/** ========== 可配置项 ========== */
const TAX_RATE = 0.05; 

/** ========== 图标（内联 SVG） ========== */
function iconStore(){
  return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 9l1.6-5.2A2 2 0 0 1 6.5 2h11a2 2 0 0 1 1.9 1.8L21 9" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M3 9h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="white" stroke-width="2" stroke-linejoin="round"/><path d="M9 22V12h6v10" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;
}
function iconCart(){
  return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.6L5 3H2" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.6" fill="#0f172a"/><circle cx="18" cy="20" r="1.6" fill="#0f172a"/></svg>`;
}
function iconArrowRight(){
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h12" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M13 6l6 6-6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function iconCartGreen(){
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.6L5 3H2" stroke="#0f8f66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.6" fill="#0f8f66"/><circle cx="18" cy="20" r="1.6" fill="#0f8f66"/></svg>`;
}

/** ========== 数据：产品列表 ========== */
function escapeXML(str){
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
}

function svgPhoto(title){
  const t = (title || '').slice(0, 12);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#e2e8f0"/></linearGradient>
      <linearGradient id="hill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cbd5e1"/><stop offset="1" stop-color="#94a3b8"/></linearGradient>
    </defs>
    <rect width="1400" height="900" fill="url(#sky)"/>
    <circle cx="1080" cy="220" r="140" fill="#ffffff" opacity="0.6"/>
    <path d="M0,620 C220,540 420,700 640,640 C820,590 980,520 1200,580 C1300,615 1360,640 1400,670 L1400,900 L0,900 Z" fill="url(#hill)" opacity="0.95"/>
    <path d="M0,700 C260,640 420,820 680,730 C890,655 1030,610 1400,690 L1400,900 L0,900 Z" fill="#64748b" opacity="0.25"/>
    <text x="90" y="120" font-family="system-ui, sans-serif" font-size="54" font-weight="900" fill="#0f172a" opacity="0.92">${escapeXML(t)}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg.trim());
}

function svgHero(){
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
    <defs>
      <linearGradient id="g0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e5e7eb"/></linearGradient>
      <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.0"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.9"/></linearGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#g0)"/>
    <rect x="0" y="0" width="1600" height="560" fill="#f8fafc"/>
    <g opacity="0.28" fill="#0f172a">
      <rect x="120" y="480" width="90" height="180"/><rect x="220" y="420" width="120" height="240"/>
      <rect x="460" y="380" width="140" height="280"/><rect x="860" y="350" width="160" height="310"/>
      <rect x="1180" y="390" width="140" height="270"/>
    </g>
    <rect x="0" y="360" width="1600" height="540" fill="url(#fog)"/>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg.trim());
}



// const PRODUCTS = [
//   { id: 'P1001', name: '龙行天下加特林', price: 58.00, shortDesc: '清香回甘，适合日常冲泡。', longDesc: '精选春茶，汤色清亮，入口鲜爽回甘。建议水温 80~85℃，避免沸水直冲导致苦涩。', thumb: 'images/louyuhang1.jpg' },
//   { id: 'P1002', name: '洛洛二号', price: 39.90, shortDesc: '温润细腻，适合茶与咖啡。', longDesc: '高白瓷烧制，釉面细腻，易清洗。杯口圆润不刮口。', thumb: 'images/louyuhang2.jpg' },
//   { id: 'P1003', name: '金玉满堂', price: 24.50, shortDesc: '顺滑书写，随身记录灵感。', longDesc: 'A5 便携尺寸，内页适合钢笔与中性笔书写。', thumb: 'images/lol1.jpg' },
//   { id: 'P1004', name: '大帅', price: 49.00, shortDesc: '通话清晰，通勤耐用。', longDesc: '轻量设计，佩戴舒适；线控麦克风适合通话与网课。', thumb: 'images/入耳耳机.jpg' },
//   { id: 'P1005', name: 'lol', price: 24.50, shortDesc: '顺滑书写，随身记录灵感。', longDesc: 'A5 便携尺寸，内页适合钢笔与中性笔书写。', thumb: 'images/lol1.jpg' },
//   { id: 'P1006', name: '大帅', price: 49.00, shortDesc: '通话清晰，通勤耐用。', longDesc: '轻量设计，佩戴舒适；线控麦克风适合通话与网课。', thumb: 'images/入耳耳机.jpg' }
// ];


const PRODUCTS = [
  {
    id: "P1001",
    name: "龙行天下加特林",
    price: 28.00,
    shortDesc: "大帅花火产品",
    longDesc: " ",
    thumb: "images/龙行天下加特林.jpg"
  },
  {
    id: "P1002",
    name: "金玉满堂",
    price: 5.00,
    shortDesc: "大帅花火产品",
    longDesc: " ",
    thumb: "images/金玉满堂.jpg"
  },
  {
    id: "P1003",
    name: "酷宝贝（400g）",
    price: 10.00,
    shortDesc: "大帅花火产品",
    longDesc: "400g",
    thumb: "images/酷宝贝.jpg"
  },
  {
    id: "P1004",
    name: "孔雀开屏（大）",
    price: 28.00,
    shortDesc: "大帅花火产品",
    longDesc: "大号",
    thumb: "images/孔雀开屏大.jpg"
  },
  {
    id: "P1005",
    name: "孔雀开屏（小）",
    price: 18.00,
    shortDesc: "大帅花火产品",
    longDesc: "小号",
    thumb: "images/孔雀开屏小.jpg"
  },
  {
    id: "P1006",
    name: "18寸仙女棒",
    price: 3.00,
    shortDesc: "大帅花火产品",
    longDesc: " ",
    thumb: "images/仙女棒.jpg"
  },
  {
    id: "P1007",
    name: "舞龙棒",
    price: 8.00,
    shortDesc: "大帅花火产品",
    longDesc: " ",
    thumb: "images/舞龙棒.jpg"
  },
  {
    id: "P1008",
    name: "1.6晨光花",
    price: 15.00,
    shortDesc: "大帅花火产品",
    longDesc: " ",
    thumb: "images/晨光花.jpg"
  },
  {
    id: "P1009",
    name: "四变色",
    price: 10.00,
    shortDesc: "大帅花火产品",
    longDesc: " ",
    thumb: "images/四变色.jpg"
  },
  {
    id: "P1010",
    name: "银色喷泉",
    price: 10.00,
    shortDesc: "大帅花火产品",
    longDesc: " ",
    thumb: "images/银色喷泉.jpg"
  },
  {
    id: "P1011",
    name: "水母（带接发器）",
    price: 11.00,
    shortDesc: "大帅花火产品",
    longDesc: " ",
    thumb: "images/水母.jpg"
  }
];





/** ========== localStorage ========== */
const LS = { CART: 'simple_shop_cart_v2', CHECKOUT: 'simple_shop_checkout_v2', LAST_ORDER: 'simple_shop_last_order_v2' };

function loadJSON(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(_){ return fallback; }
}
function saveJSON(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }catch(_){}
}
function defaultCheckout(){ return { receiver: { name: '', phone: '', address: '' } }; }

/** ========== 全局状态 ========== */
const state = {
  cart: loadJSON(LS.CART, {}),
  checkout: loadJSON(LS.CHECKOUT, defaultCheckout()),
  lastOrder: loadJSON(LS.LAST_ORDER, null)
};

function persist(){
  saveJSON(LS.CART, state.cart);
  saveJSON(LS.CHECKOUT, state.checkout);
  saveJSON(LS.LAST_ORDER, state.lastOrder);
}

/** ========== 工具函数 ========== */
function escapeHTML(str){
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
}
function money(n){ return '¥' + (Number(n)||0).toFixed(2); }
function getProductById(id){ return PRODUCTS.find(p => p.id === id) || null; }
function getCartCount(){ return Object.values(state.cart).reduce((sum, q) => sum + (Number(q) || 0), 0); }
function computeCartItems(){
  const items = [];
  for(const [id, qtyRaw] of Object.entries(state.cart)){
    const qty = Math.max(0, Math.floor(Number(qtyRaw) || 0));
    if(qty > 0 && getProductById(id)){
      const p = getProductById(id);
      items.push({ id: p.id, name: p.name, price: p.price, qty, line: p.price * qty });
    }
  }
  items.sort((a,b) => a.id.localeCompare(b.id));
  return items;
}
function computeTotals(items){
  const subtotal = items.reduce((sum, it) => sum + it.line, 0);
  const tax = subtotal * TAX_RATE;
  return { subtotal, tax, total: subtotal };
}
function makeOrderNo(){
  const d = new Date();
  const rand = String(Math.floor(Math.random()*900000) + 100000);
  return `CN${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${rand}`;
}
function setDeep(obj, path, value){
  if(!obj || !path) return;
  const parts = path.split('.');
  let cur = obj;
  for(let i=0; i<parts.length-1; i++){
    if(typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length-1]] = value;
}

/** ========== Toast ========== */
function toast(message, kind='ok'){
  const root = document.getElementById('toast-root');
  if(!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="dot ${kind === 'danger' ? 'danger' : ''}"></span><div>${escapeHTML(message)}</div>`;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => el.remove(), 220);
  }, 2200);
}

// new add
async function copyTextSafe(text, textareaEl) {
  // 1) 优先使用现代 Clipboard API（需要 HTTPS / 安全上下文）
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // 继续走 fallback
  }

  // 2) fallback：兼容 Safari / HTTP / 非安全上下文
  try {
    const el = textareaEl || document.createElement("textarea");
    if (!textareaEl) {
      el.value = text;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
    }
    el.focus();
    el.select();

    const ok = document.execCommand("copy");

    if (!textareaEl) document.body.removeChild(el);
    return ok;
  } catch (e) {
    return false;
  }
}


/** ========== 路由与渲染 ========== */
function getPath(){ return (location.hash || '#/').slice(1).split('?')[0] || '/'; }
function setTitle(title){ document.title = title ? `${title} - 大帅花火` : '大帅花火'; }

function layout(mainHTML){
  const count = getCartCount();
  return `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="#/"><span class="brand-icon">${iconStore()}</span><span class="brand-name">大帅花火</span></a>
        <div class="nav">
          <a class="nav-link" href="#/products">浏览商品</a>
          <a class="cart-link" href="#/checkout">
            ${iconCart()}<span class="${count > 0 ? 'cart-badge' : 'cart-badge is-empty'}">${count}</span>
          </a>
        </div>
      </div>
    </header>
    <main class="container">${mainHTML}<div class="footer-note">说明：本示例不提供在线支付功能，所有支付均采用线下方式。</div></main>
  `;
}

function render(){
  const app = document.getElementById('app');
  if(!app) return;
  const path = getPath();

  if(path === '/' || path === ''){
    setTitle('首页'); app.innerHTML = layout(renderHome()); bindHome(); return;
  }
  if(path === '/products'){
    setTitle('产品'); app.innerHTML = layout(renderProducts()); bindProducts(); return;
  }
  if(path.startsWith('/product/')){
    setTitle('产品详情'); 
    const id = decodeURIComponent(path.split('/')[2] || '');
    app.innerHTML = layout(renderProductDetail(id)); 
    bindProductDetail(id); 
    return;
  }
  if(path === '/cart' || path === '/checkout'){
    setTitle('购物车'); app.innerHTML = layout(renderCart()); bindCart(); return;
  }
  if(path === '/order-success'){
    setTitle('下单成功'); app.innerHTML = layout(renderOrderSuccess()); bindOrderSuccess(); return;
  }

  setTitle('404'); app.innerHTML = layout(`<div class="panel notice danger"><strong>页面不存在</strong></div><div class="row" style="margin-top:14px;"><a class="btn primary" href="#/">返回首页</a></div>`);
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

/** ========== 页面视图 ========== */
function renderHome(){
  return `
    <section class="hero">
      <h1>欢迎来到<br><span class="highlight">大帅花火</span></h1>
      <p>我们为您提供精选的优质商品。体验简单、快捷的购物流程。</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/products">查看产品 ${iconArrowRight()}</a>
        <a class="btn soft" href="#/checkout">查看购物车 ${iconCartGreen()}</a>
      </div>
      <div class="hero-photo"><img src="${svgHero()}" alt=""/></div>
    </section>`;
}
function bindHome(){}

function renderProducts(){
  const cards = PRODUCTS.map(p => `
    <article class="card product-card">
      <img src="${p.thumb}" alt="${escapeHTML(p.name)}" loading="lazy"/>
      <div class="product-body">
        <h3 class="product-title">${escapeHTML(p.name)}</h3>
        <p class="product-desc">${escapeHTML(p.shortDesc)}</p>
        <div class="product-bottom"><div class="price">${money(p.price)}</div><a class="btn outline" href="#/product/${encodeURIComponent(p.id)}">查看</a></div>
      </div>
    </article>`).join('');
  return `<div class="section-title">精选商品</div><div class="grid">${cards}</div>`;
}
function bindProducts(){}

function renderProductDetail(id){
  const p = getProductById(id);
  if(!p) return `<div class="panel notice danger">未找到该产品。</div><div class="row" style="margin-top:14px;"><a class="btn primary" href="#/products">返回产品列表</a></div>`;
  return `
    <div class="detail">
      <div class="detail-media"><img src="${p.thumb}" alt="${escapeHTML(p.name)}"/></div>
      <div class="panel detail-panel">
        <div class="section-title" style="margin-top:0;">产品详情</div>
        <h2>${escapeHTML(p.name)}</h2>
        <div class="price">${money(p.price)}</div>
        <div class="kv" role="list"><div role="listitem">描述</div><div role="listitem">${escapeHTML(p.longDesc)}</div></div>
        <div class="row" style="margin-top:16px;">
          <button class="btn primary" data-action="add-to-cart" data-id="${escapeHTML(p.id)}">加入购物车</button>
          <a class="btn outline" href="#/products">继续浏览</a>
        </div>
      </div>
    </div>`;
}
function bindProductDetail(id){
  const btn = document.querySelector('[data-action="add-to-cart"]');
  if(btn) btn.onclick = () => { addToCart(id, 1); toast('已加入购物车', 'ok'); render(); };
}

function renderCart(){
  const items = computeCartItems();
  const { subtotal, tax, total } = computeTotals(items);
  const recv = (state.checkout && state.checkout.receiver) ? state.checkout.receiver : { name:'', phone:'', address:'' };

  if(items.length === 0){
    return `<div class="panel notice">购物车是空的。</div><div class="row" style="margin-top:14px;"><a class="btn primary" href="#/products">去逛逛</a></div>`;
  }

  const list = items.map(it => `
    <div class="cart-row">
      <img class="cart-thumb" src="${getProductById(it.id)?.thumb}" alt=""/>
      <div class="cart-info">
        <div class="cart-name">${escapeHTML(it.name)}</div>
        <div class="cart-meta">${money(it.price)}</div>
        <div class="cart-actions">
          <div class="qty-stepper">
            <button type="button" data-action="qty-dec" data-id="${it.id}">−</button>
            <input type="text" readonly value="${it.qty}" style="width:30px;text-align:center;border:none;background:transparent;">
            <button type="button" data-action="qty-inc" data-id="${it.id}">+</button>
          </div>
          <span class="remove-link" data-action="remove" data-id="${it.id}">移除</span>
        </div>
      </div>
      <div class="cart-row-right"><div class="cart-price">${money(it.line)}</div></div>
    </div>`).join('');

  return `
    <div class="section-title">购物车</div>
    <div class="checkout-grid">
      <div>
        <div class="cart-list">${list}</div>
        <div class="clear-row" style="margin-top:14px;"><button class="clear-btn" data-action="cancel-order">清空购物车</button></div>
        <div class="section-title" style="margin-top:18px;">收货信息</div>
        <div class="panel shipping-card">
          <div class="form-grid">
            <div class="field"><label>收件人姓名</label><input class="input" type="text" value="${escapeHTML(recv.name)}" data-checkout="receiver.name"/></div>
            <div class="field"><label>联系电话</label><input class="input" type="tel" value="${escapeHTML(recv.phone)}" data-checkout="receiver.phone"/></div>
          </div>
          <div class="field" style="margin-top:12px;"><label>详细地址</label><textarea class="input" data-checkout="receiver.address">${escapeHTML(recv.address)}</textarea></div>
        </div>
      </div>
      <aside class="order-summary">
        <div class="panel summary-card">
          <div class="summary-title">订单摘要</div>
          <div class="summary-row"><span>商品小计</span><strong>${money(subtotal)}</strong></div>
          <div class="summary-row tax-row is-disabled"><span>运费</span><strong>${money(tax)}</strong></div>
          <div class="summary-row" style="padding-top:14px;"><span><strong>总计</strong></span><strong class="summary-total">${money(total)}</strong></div>
          <button class="btn primary summary-btn" data-action="place-order" style="margin-top:16px;">确认下单</button>
        </div>
      </aside>
    </div>`;
}

/** ========== 逻辑：购物车与下单 (之前缺失的部分) ========== */

// 1. 之前缺失的 bindCart 函数
function bindCart(){
  // 绑定数量增加
  document.querySelectorAll('[data-action="qty-inc"]').forEach(el => {
    el.onclick = (e) => { e.preventDefault(); handleQtyInc(el.getAttribute('data-id')); };
  });
  // 绑定数量减少
  document.querySelectorAll('[data-action="qty-dec"]').forEach(el => {
    el.onclick = (e) => { e.preventDefault(); handleQtyDec(el.getAttribute('data-id')); };
  });
  // 绑定移除
  document.querySelectorAll('[data-action="remove"]').forEach(el => {
    el.onclick = (e) => { e.preventDefault(); handleRemove(el.getAttribute('data-id')); };
  });
  // 绑定清空
  const btnClear = document.querySelector('[data-action="cancel-order"]');
  if(btnClear) btnClear.onclick = (e) => { e.preventDefault(); handleCancelOrder(); };

  // 绑定下单
  const btnPlace = document.querySelector('[data-action="place-order"]');
  if(btnPlace) btnPlace.onclick = (e) => { e.preventDefault(); handlePlaceOrder(); };

  // 绑定输入框（输入时自动保存）
  document.querySelectorAll('[data-checkout]').forEach(input => {
    input.addEventListener('input', (e) => {
      setDeep(state.checkout, e.target.dataset.checkout, e.target.value);
      persist(); // 立即保存到 localStorage
    });
  });
}

// 2. 之前缺失的 renderOrderSuccess 函数
function renderOrderSuccess(){
  if(!state.lastOrder){
    return `<div class="panel notice">没有找到刚才的订单信息。</div><div class="row" style="margin-top:14px;"><a class="btn primary" href="#/">返回首页</a></div>`;
  }
  const o = state.lastOrder;
  const text = buildOrderText(o);
  
  return `
    <div class="section-title">下单成功！</div>
    <div class="panel" style="background:#f0fdf4; border-color:#bbf7d0;">
      <h2 style="color:#166534; margin-top:0;">订单已生成：${o.orderNo}</h2>
      <p>请将下方订单详情复制，发送给商家（微信/邮件）以完成支付和发货。</p>
    </div>
    <div class="panel" style="margin-top:16px;">
      <textarea class="input" style="height:200px; font-family:monospace;" readonly>${text}</textarea>
      <div class="row" style="margin-top:12px;">
         <button class="btn primary" data-action="copy-order-preview">复制订单详情</button>
         <a class="btn soft" href="#/">返回首页</a>
      </div>
    </div>
  `;
}

// 3. 之前缺失的 bindOrderSuccess 函数
function bindOrderSuccess(){
  const btn = document.querySelector('[data-action="copy-order-preview"]');
  if(btn){
    btn.onclick = async () => {
      const txt = document.querySelector('textarea')?.value || '';
      try{
        // await navigator.clipboard.writeText(txt);
        const ok = await copyTextSafe(txt, document.querySelector('textarea'));
        toast('复制成功！', 'ok');
      }catch(e){
        toast('复制失败，请手动全选复制', 'danger');
      }
    };
  }
}

// 购物车具体动作逻辑
function addToCart(id, qty){
  const current = Math.max(0, Math.floor(Number(state.cart[id]) || 0));
  state.cart[id] = current + qty;
  persist();
}
function handleQtyInc(id){
  addToCart(id, 1); render();
}
function handleQtyDec(id){
  const current = Math.max(0, Math.floor(Number(state.cart[id]) || 0));
  if(current <= 1) delete state.cart[id];
  else state.cart[id] = current - 1;
  persist(); render();
}
function handleRemove(id){
  delete state.cart[id]; persist(); render(); toast('已移除', 'ok');
}
function handleCancelOrder(){
  state.cart = {}; persist(); render(); toast('购物车已清空', 'ok');
}

// 4. 之前缺失的 validateCheckout 函数
function validateCheckout(){
  const r = state.checkout.receiver || {};
  if(!r.name || !r.name.trim()) return { ok:false, message: '请填写收件人姓名' };
  if(!r.phone || !r.phone.trim()) return { ok:false, message: '请填写联系电话' };
  if(!r.address || !r.address.trim()) return { ok:false, message: '请填写详细地址' };
  return { ok:true };
}

function handlePlaceOrder(){
  // 校验
  const v = validateCheckout();
  if(!v.ok){ toast(v.message, 'danger'); return; }

  const items = computeCartItems();
  const { subtotal, tax, total } = computeTotals(items);
  
  // 生成订单数据
  state.lastOrder = {
    orderNo: makeOrderNo(),
    createdAt: new Date().toISOString(),
    items,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    receiver: {...state.checkout.receiver}
  };

  // 清空购物车并保存
  state.cart = {};
  persist();

  // 跳转
  location.hash = '#/order-success';
  render();
}

function buildOrderText(order){
  let s = `【订单号】${order.orderNo}\n【时间】${order.createdAt.slice(0,16).replace('T',' ')}\n\n`;
  order.items.forEach(it => { s += `${it.name} x ${it.qty} (¥${(it.price*it.qty).toFixed(2)})\n`; });
  s += `\n运费（已免）：¥${order.tax}\n`;
  s += `\n总计（不含运费）：¥${order.total}\n\n【收货人】\n${order.receiver.name} / ${order.receiver.phone}\n${order.receiver.address}`;
  return s;
}