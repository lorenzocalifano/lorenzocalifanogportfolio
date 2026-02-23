/* ================================================
   main.js — Portfolio Lorenzo Califano
   ================================================ */

(function () {
    'use strict';

    // ---- Particle canvas in hero ----

    var canvas = document.getElementById('hero-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: null, y: null };
    var colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + .8;
        this.speedX = (Math.random() - 0.5) * .6;
        this.speedY = (Math.random() - 0.5) * .6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * .5 + .15;
    }

    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;

        // bordi: ricompare dall'altro lato
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    };

    function initParticles() {
        particles = [];
        // piu particelle su schermi grandi
        var count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 160);
        for (var i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(255,255,255,' + (1 - dist / 120) * 0.08 + ')';
                    ctx.lineWidth = .5;
                    ctx.stroke();
                }
            }
        }
    }

    // linea dal mouse alla particella vicina
    function drawMouseLines() {
        if (!mouse.x) return;
        for (var i = 0; i < particles.length; i++) {
            var dx = mouse.x - particles[i].x;
            var dy = mouse.y - particles[i].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(particles[i].x, particles[i].y);
                ctx.strokeStyle = 'rgba(66,133,244,' + (1 - dist / 180) * 0.25 + ')';
                ctx.lineWidth = .6;
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        drawLines();
        drawMouseLines();
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', function () {
        resizeCanvas();
        initParticles();
    });

    canvas.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    canvas.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
    });

    // ---- Navbar scroll effect ----

    var navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---- Scroll reveal con IntersectionObserver ----

    var revealTargets = document.querySelectorAll(
        '.about-grid, .project-card, .contact-links, .section-title, .section-subtitle, .contact-text'
    );

    revealTargets.forEach(function (el) {
        el.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // una sola volta
            }
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
        observer.observe(el);
    });

    // ---- PDF Modal ----

    var modal = document.getElementById('pdf-modal');
    var viewer = document.getElementById('pdf-viewer');
    var modalTitle = document.getElementById('modal-title');

    window.openPdf = function (path, btnElement) {
        // ricavo il titolo dalla card
        var card = btnElement.closest('.project-card');
        var title = card ? card.querySelector('.card-title').textContent : 'Relazione';
        modalTitle.textContent = title;

        viewer.src = path;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closePdf = function () {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // svuoto src per fermare il caricamento
        setTimeout(function () { viewer.src = ''; }, 350);
    };

    window.closePdfOutside = function (e) {
        if (e.target === modal) {
            window.closePdf();
        }
    };

    // chiudi con ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            window.closePdf();
        }
    });

})();
