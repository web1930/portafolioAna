(function() {
  'use strict';  
  const encodedEmailRev = 'moc.liamg@510tovedolebana';
  const encodedPhoneRev = '9009627511945';          
  const reverseString = (str) => str.split('').reverse().join('');
  let realEmail = '';
  let realPhone = '';
  let dataLoaded = false;
  const isLikelyBot = () => {
    if (navigator.webdriver) return true;
    if (window._phantom || window.__nightmare) return true;
    if (navigator.userAgent.includes('Headless')) return true;
    if (navigator.userAgent.includes('Puppeteer')) return true;
    return false;
  };
  const loadContactData = () => {
    if (dataLoaded) return;
    if (isLikelyBot()) {
      console.warn('Bot detectado: datos de contacto no expuestos');
      return;
    }
    realEmail = reverseString(encodedEmailRev);
    realPhone = reverseString(encodedPhoneRev);
    const emailLink = document.getElementById('email-link');
    if (emailLink && emailLink.textContent === '---') {
      emailLink.href = `mailto:${realEmail}`;
      emailLink.textContent = realEmail;
    }
    const phoneDisplay = document.getElementById('phone-display');
    if (phoneDisplay && phoneDisplay.textContent === '---') {
      const formatted = `+54 9 11 ${realPhone.slice(5,9)}-${realPhone.slice(9)}`;
      phoneDisplay.textContent = formatted;
    }
    const waLinks = document.querySelectorAll('#whatsapp-link');
    waLinks.forEach(link => {
      if (link.getAttribute('href') === '#') {
        link.href = `https://wa.me/${realPhone}`;
      }
    });
    dataLoaded = true;
  };
  const initHumanTrigger = () => {
    const humanEvents = ['mousemove', 'scroll', 'click', 'keydown', 'touchstart'];
    let triggered = false;
    const onHumanInteraction = () => {
      if (triggered) return;
      triggered = true;
      loadContactData();
      humanEvents.forEach(event => {
        window.removeEventListener(event, onHumanInteraction);
      });
    };
    humanEvents.forEach(event => {
      window.addEventListener(event, onHumanInteraction, { passive: true });
    });
    setTimeout(() => {
      if (!triggered) onHumanInteraction();
    }, 3500);
  };
  const initSecureCV = () => {
    const cvBtn = document.getElementById('cv-download');
    if (!cvBtn) return;
    cvBtn.removeAttribute('download');
    cvBtn.href = '#';
    const downloadCV = async (e) => {
      e.preventDefault();
      if (isLikelyBot()) {
        alert('Acceso denegado: actividad automatizada detectada.');
        return;
      }
      const imgUrl = 'assets/cv-anabella.png';
      try {
        const response = await fetch(imgUrl, { mode: 'cors', cache: 'no-store' });
        if (!response.ok) throw new Error('CV no encontrado');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CV_Anabella_Devoto.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        if (confirm('No se pudo descargar automáticamente. ¿Abrir el CV en una nueva pestaña?')) {
          window.open(imgUrl, '_blank');
        }
      }
    };
    cvBtn.addEventListener('click', downloadCV);
  };
  const initTheme = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    const applyTheme = (newTheme) => {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      if (icon) {
        icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    };
    applyTheme(theme);
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  };
  const initTypewriter = () => {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;
    const phrases = ['enfermera profesional', 'compromiso con cada paciente', 'disponibilidad full time', 'movilidad propia', 'vocación de servicio'];
    let phraseIndex = 0, charIndex = 0, isDeleting = false, timeoutId = null;
    const type = () => {
      if (!typedElement.isConnected) { if (timeoutId) clearTimeout(timeoutId); return; }
      const current = phrases[phraseIndex];
      typedElement.textContent = current.substring(0, charIndex);
      if (!isDeleting && charIndex < current.length) {
        charIndex++;
        timeoutId = setTimeout(type, 80);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        timeoutId = setTimeout(type, 40);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) phraseIndex = (phraseIndex + 1) % phrases.length;
        timeoutId = setTimeout(type, isDeleting ? 500 : 1200);
      }
    };
    type();
  };
  const initTimeline = () => {
    const dots = document.querySelectorAll('.timeline-dot');
    if (!dots.length) return;
    const toggleDetalle = (dot) => {
      const item = dot.closest('.timeline-item');
      if (!item) return;
      const content = item.querySelector('.timeline-content');
      const detalle = item.querySelector('.detalle-expandible');
      const isExpanded = detalle && detalle.style.display === 'block';
      if (content) content.classList.toggle('highlight', !isExpanded);
      if (detalle) {
        detalle.style.display = isExpanded ? 'none' : 'block';
        dot.setAttribute('aria-expanded', !isExpanded);
      }
    };
    dots.forEach(dot => {
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Ver detalle');
      dot.setAttribute('aria-expanded', 'false');
      dot.title = 'Ver detalle';
      dot.addEventListener('click', () => toggleDetalle(dot));
      dot.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDetalle(dot); } });
    });
  };
  const setActiveNavLink = () => {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentFile) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  };
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    initTheme();
    initTypewriter();
    initTimeline();
    initSecureCV();
    initHumanTrigger();
  });
})();