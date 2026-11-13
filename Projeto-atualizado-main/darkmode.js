// Aplica o tema salvo imediatamente para evitar flash de cor ao carregar
(function() {
    const savedTheme = localStorage.getItem('ruan_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-button');

    themeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Alterna a classe 'light-mode' no body
            document.body.classList.toggle('light-mode');

            // Salva a preferência atual no localStorage
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('ruan_theme', 'light');
            } else {
                localStorage.setItem('ruan_theme', 'dark');
            }
        });
    });
});