function entrarALaWeb() {
    const intro = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    
    if (intro) {
        // Desvanece la intro
        intro.classList.add('fade-out');
        
        // Activa la visualización suave de la web principal
        if (mainContent) {
            mainContent.classList.add('visible');
        }
        
        // Devuelve el scroll al navegador tras terminar la animación
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 800); 
    }
}

// Menú móvil (hamburguesa)
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');

    if (!navToggle || !navLinks || !navBackdrop) return;

    function abrirMenu() {
        navToggle.classList.add('open');
        navLinks.classList.add('open');
        navBackdrop.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function cerrarMenu() {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navBackdrop.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
    }

    navToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    navBackdrop.addEventListener('click', cerrarMenu);

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', cerrarMenu);
    });
});