/* Arun Prakash · Portfolio */
(function siteScript(){
  var root = document.documentElement, body = document.body;
  try { var saved = localStorage.getItem('pf-theme'); if (saved && !root.getAttribute('data-theme')) root.setAttribute('data-theme', saved); } catch (e) {}
  function isDark(){ var a = root.getAttribute('data-theme'); return a ? a === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; }
  var tt = document.getElementById('themeToggle');
  if (tt) tt.addEventListener('click', function(){
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('pf-theme', next); } catch (e) {}
  });

  var nav = document.getElementById('nav'), burger = document.getElementById('burger');
  function closeMenu(){ if (!nav) return; nav.classList.remove('open'); body.classList.remove('lock'); if (burger) burger.setAttribute('aria-expanded', 'false'); }
  if (burger) burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    body.classList.toggle('lock', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeMenu(); });

  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href').slice(1);
      var el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  });

  var links = document.querySelectorAll('.links a'), byId = {};
  links.forEach(function(a){ byId[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        links.forEach(function(l){ l.classList.remove('active'); });
        if (byId[en.target.id]) byId[en.target.id].classList.add('active');
      });
    }, {rootMargin: '-45% 0px -50% 0px'});
    document.querySelectorAll('section[id]').forEach(function(s){ spy.observe(s); });

    var rv = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        rv.unobserve(el);
        setTimeout(function(){ el.classList.remove('rv', 'in'); }, 900);
      });
    }, {threshold: 0.08, rootMargin: '0px 0px -30px 0px'});
    document.querySelectorAll('.rv').forEach(function(el){ rv.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.remove('rv'); });
  }

  var up = document.getElementById('totop');
  function onScroll(){
    if (up) up.classList.toggle('show', window.scrollY > 600);
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  var fbtns = document.querySelectorAll('.filters button');
  fbtns.forEach(function(b){
    b.addEventListener('click', function(){
      var f = b.getAttribute('data-f');
      fbtns.forEach(function(x){ x.classList.toggle('active', x === b); });
      document.querySelectorAll('.proj').forEach(function(p){ p.hidden = f !== '*' && p.getAttribute('data-cat') !== f; });
    });
  });

  document.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('.btn') : null;
    if (!b) return;
    var r = b.getBoundingClientRect(), s = document.createElement('span');
    s.className = 'ripple';
    s.style.left = (e.clientX - r.left) + 'px';
    s.style.top = (e.clientY - r.top) + 'px';
    b.appendChild(s);
    setTimeout(function(){ s.remove(); }, 650);
  });

  if (body.classList.contains('A-tilt') && window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('.card').forEach(function(c){
      c.addEventListener('mousemove', function(e){
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = 'perspective(800px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 8) + 'deg) translateY(-4px)';
        c.style.setProperty('--mx', (x + 0.5) * 100 + '%');
        c.style.setProperty('--my', (y + 0.5) * 100 + '%');
      });
      c.addEventListener('mouseleave', function(){ c.style.transform = ''; });
    });
  }

  var form = document.getElementById('cform');
  if (form) form.addEventListener('submit', function(e){
    e.preventDefault();
    var n = form.elements.name.value.trim(), m = form.elements.message.value.trim();
    window.location.href = 'mailto:' + form.getAttribute('data-to') +
      '?subject=' + encodeURIComponent('Hello from ' + (n || 'your portfolio')) +
      '&body=' + encodeURIComponent(m + (n ? '\n\n- ' + n : ''));
  });

  document.querySelectorAll('[data-pending]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      alert('Preview only. On your live website this button downloads your ATS resume PDF.');
    });
  });

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
