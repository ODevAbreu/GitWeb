document.addEventListener('scroll', function() {
    const footer = document.getElementById('footer');
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    // Mostrar rodapé se o usuário rolar até o final da página
    if (scrollPosition >= documentHeight) {
        footer.classList.add('visible');
    } else {
        footer.classList.remove('visible');
    }
});
document.addEventListener('scroll', function() {
    const footer = document.getElementById('footer');
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    // Mostrar rodapé se o usuário rolar até o final da página
    if (scrollPosition >= documentHeight) {
        footer.classList.add('visible');
    } else {
        footer.classList.remove('visible');
    }
});
