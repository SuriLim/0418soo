/* ============================
   GYEOL Hair Mascara — 인터랙션 스크립트
   ============================ */

// ── 네비게이션: 스크롤 시 배경 추가 ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── 모바일 메뉴 토글 ──────────────────────────────────────────
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// 모바일 링크 클릭 시 메뉴 닫기
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ── 히어로 슬라이드쇼 ────────────────────────────────────────
const heroImgs = document.querySelectorAll('.hero-img');
const dots     = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideTimer;

function goToSlide(index) {
  // 기존 슬라이드 비활성화
  heroImgs[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = index;

  // 새 슬라이드 활성화
  heroImgs[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  const next = (currentSlide + 1) % heroImgs.length;
  goToSlide(next);
}

function startSlideshow() {
  slideTimer = setInterval(nextSlide, 4500);
}

// 닷 버튼으로 수동 이동
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(slideTimer);
    goToSlide(i);
    startSlideshow();
  });
});

startSlideshow();

// ── Intersection Observer: 스크롤 reveal ─────────────────────
const revealEls = document.querySelectorAll('.reveal, .product-card');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  }
);

revealEls.forEach(el => observer.observe(el));

// ── 부드러운 앵커 스크롤 (네비게이션 높이 보정) ──────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navH   = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-h'), 10) || 70;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 제품 카드 호버 사운드 없는 미세 인터랙션 ─────────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
    card.style.transform  = 'translateY(-8px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = 'translateY(0)';
  });
});

// ── 패럴랙스 효과: detail-bg (배경 고정 폴백) ────────────────
// iOS/Safari에서 background-attachment: fixed가 지원 안 될 때 JS로 보완
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isIOS    = /iPad|iPhone|iPod/.test(navigator.userAgent);

if (isSafari || isIOS) {
  const detailBgs = document.querySelectorAll('.detail-bg');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    detailBgs.forEach(bg => {
      const parent = bg.parentElement;
      const rect   = parent.getBoundingClientRect();
      const ratio  = rect.top / window.innerHeight;
      const offset = ratio * 40; // 패럴랙스 강도
      bg.style.transform = `translateY(${offset}px) scale(1.08)`;
    });
  }, { passive: true });
}

// ── 스크롤 진행률 표시 (히어로 스크롤 힌트 제거) ─────────────
const scrollHint = document.querySelector('.hero-scroll-hint');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    scrollHint.style.opacity = '0';
  } else {
    scrollHint.style.opacity = '1';
  }
}, { passive: true });

// ── 페이지 로드 완료 시 초기 reveal 트리거 ───────────────────
window.addEventListener('load', () => {
  // 뷰포트 안에 이미 들어와 있는 요소 즉시 표시
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('visible');
    }
  });
});
