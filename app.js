/* ==============================
   Navbar 滾動效果
   ============================== */
const navbar = document.querySelector('.navbar')

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50)
})

/* ==============================
   手機漢堡選單
   ============================== */
const toggleBtn = document.querySelector('.nav-toggle')
const navMenu = document.querySelector('.nav-menu')

toggleBtn.addEventListener('click', () => {
  navMenu.classList.toggle('open')
})

// 點擊選項後自動關閉選單
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'))
})

/* ==============================
   Before / After 對比滑桿
   ============================== */
const slider = document.querySelector('.comparison-slider')
const beforeImg = document.querySelector('.img-before')
const handle = document.querySelector('.slider-handle')

let isDragging = false
let suppressTransitions = false
let moveRAF = null

/**
 * 根據滑鼠/手指 X 座標，更新拉桿位置與 Before 圖片寬度
 */
function updateSlider(clientX) {
  if (!slider) return

  const rect = slider.getBoundingClientRect()
  let percent = ((clientX - rect.left) / rect.width) * 100

  // 邊界限制 0% ~ 100%
  percent = Math.max(0, Math.min(100, percent))

  handle.style.left = `${percent}%`
  beforeImg.style.width = `${percent}%`
}

/**
 * requestAnimationFrame 包裹，避免短時間內大量觸發
 */
function moveSlider(clientX) {
  if (moveRAF) cancelAnimationFrame(moveRAF)
  moveRAF = requestAnimationFrame(() => updateSlider(clientX))
}

/* ----- 滑鼠事件 ----- */
handle.addEventListener('mousedown', (e) => {
  isDragging = true
  e.preventDefault()
})

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return
  moveSlider(e.clientX)
})

window.addEventListener('mouseup', () => {
  isDragging = false
})

/* ----- 觸控事件（手機/平板）----- */
handle.addEventListener('touchstart', (e) => {
  isDragging = true
  e.preventDefault()
}, { passive: false })

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return
  moveSlider(e.touches[0].clientX)
}, { passive: false })

window.addEventListener('touchend', () => {
  isDragging = false
})

/* ----- 鍵盤支援（無障礙）----- */
document.addEventListener('keydown', (e) => {
  if (!slider) return
  const current = parseFloat(handle.style.left) || 50
  const step = e.shiftKey ? 10 : 2

  if (e.key === 'ArrowRight') updateSlider(slider.getBoundingClientRect().left + (current + step) * slider.offsetWidth / 100)
  if (e.key === 'ArrowLeft')  updateSlider(slider.getBoundingClientRect().left + (current - step) * slider.offsetWidth / 100)
})

/* ==============================
   預約表單提交 → Google Form
   ⚠ 建立 Google 表單後，請置換下方 FORM_ID 與 entry ID
   ============================== */
const form = document.getElementById('contact-form')

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const name = document.getElementById('form-name').value.trim()
    const phone = document.getElementById('form-phone').value.trim()
    const dateVal = document.getElementById('form-date').value
    const timeVal = document.getElementById('form-time').value
    const note = document.getElementById('form-note').value.trim()

    if (!name || !phone || !dateVal || !timeVal) {
      alert('請填寫姓名、電話、日期與時間')
      return
    }

    const btn = form.querySelector('.form-btn')
    btn.textContent = '送出中…'
    btn.disabled = true

    // ── 組合日期時間 ──
    const dateStr = dateVal
    const timeStr = timeVal.includes(':') ? timeVal : timeVal + ':00'

    // ── Google Form 提交 ──
    // 使用真實瀏覽器 form submit 到隱藏 iframe，相容所有裝置
    const FORM_ID = '1FAIpQLSfcqBBKlCHvZliwFg_gNdwSWlP5-wWnXJicbSWGCH_lTm8Xuw'

    // 在 form 內插入 hidden input 對應 Google Form 欄位
    const hiddenFields = {
      'entry.1603649042': name,
      'entry.2067886548': phone,
      'entry.1058156312': `${dateStr} ${timeStr}`,
      'entry.1762837529': note
    }

    for (const [k, v] of Object.entries(hiddenFields)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = k
      input.value = v
      form.appendChild(input)
    }

    // 設定提交目標為隱藏 iframe
    form.action = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`
    form.target = 'gform-target'
    form.method = 'POST'

    // 使用真實瀏覽器提交（最可靠的方式）
    form.submit()

    // 顯示成功訊息
    form.innerHTML = `
      <div class="form-success show">
        <h3>預約成功</h3>
        <p>我們將盡快與您確認時段，謝謝！</p>
      </div>
    `
  })
}
