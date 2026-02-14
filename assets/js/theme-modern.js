(function () {
  function initThemeToggle() {
    var body = document.body;
    if (!body.classList.contains('theme-modern')) return;

    var storedTheme = '';
    try {
      storedTheme = window.localStorage.getItem('portfolio-theme') || '';
    } catch (error) {
      storedTheme = '';
    }

    if (storedTheme === 'light') {
      body.classList.add('theme-light');
    }

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-toggle';

    function updateLabel() {
      var lightActive = body.classList.contains('theme-light');
      toggle.textContent = lightActive ? 'Dark' : 'Light';
      toggle.setAttribute('aria-label', lightActive ? 'Switch to dark mode' : 'Switch to light mode');
    }

    toggle.addEventListener('click', function () {
      body.classList.toggle('theme-light');
      var lightActive = body.classList.contains('theme-light');
      try {
        window.localStorage.setItem('portfolio-theme', lightActive ? 'light' : 'dark');
      } catch (error) {
        // Ignore storage errors.
      }
      updateLabel();
    });

    updateLabel();
    body.appendChild(toggle);
  }

  function initTabs() {
    var groups = document.querySelectorAll('.tabs');
    groups.forEach(function (group) {
      var links = group.querySelectorAll('.tab-links a');
      var tabs = group.querySelectorAll('.tab');
      if (!links.length || !tabs.length) return;

      links.forEach(function (link) {
        link.addEventListener('click', function (event) {
          event.preventDefault();
          var targetId = link.getAttribute('href');
          var target = group.querySelector(targetId);
          if (!target) return;

          links.forEach(function (item) {
            item.classList.remove('active');
          });
          tabs.forEach(function (item) {
            item.classList.remove('active');
          });

          link.classList.add('active');
          target.classList.add('active');
        });
      });
    });
  }

  function initTyping() {
    var rotator = document.querySelector('.typing-rotator[data-rotate]');
    if (!rotator) return;

    var words = rotator
      .getAttribute('data-rotate')
      .split('|')
      .map(function (word) {
        return word.trim();
      })
      .filter(Boolean);

    if (!words.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isPaused = false;

    function pause() {
      isPaused = true;
    }

    function resume() {
      isPaused = false;
    }

    rotator.addEventListener('mouseenter', pause);
    rotator.addEventListener('mouseleave', resume);
    rotator.addEventListener('focus', pause);
    rotator.addEventListener('blur', resume);
    rotator.addEventListener('click', function () {
      pause();
      window.setTimeout(resume, 1800);
    });

    if (reduceMotion) {
      var idxReduce = 0;
      rotator.textContent = words[idxReduce];
      setInterval(function () {
        if (isPaused) return;
        idxReduce = (idxReduce + 1) % words.length;
        rotator.textContent = words[idxReduce];
      }, 3600);
      return;
    }

    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function step() {
      if (isPaused) {
        window.setTimeout(step, 160);
        return;
      }

      var currentWord = words[wordIndex];

      if (!deleting) {
        charIndex += 1;
        rotator.textContent = currentWord.slice(0, charIndex);

        if (charIndex >= currentWord.length) {
          deleting = true;
          window.setTimeout(step, 2400);
          return;
        }

        window.setTimeout(step, 64);
        return;
      }

      charIndex -= 1;
      rotator.textContent = currentWord.slice(0, charIndex);

      if (charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        window.setTimeout(step, 520);
        return;
      }

      window.setTimeout(step, 38);
    }

    rotator.textContent = '';
    window.setTimeout(step, 520);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initTabs();
    initTyping();
  });
})();
