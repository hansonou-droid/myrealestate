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
