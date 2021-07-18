import "./styles.scss";
console.log("hello world!");

window.onload = function () {
    var navOpenButton = document.querySelector('#navOpenButton');
    var navLinks = document.querySelector('#navLinks');
    var navCloseButton = document.querySelector('#navCloseButton');

    navOpenButton.addEventListener('click', function () {
        navOpenButton.setAttribute('aria-expanded', "true");
        navLinks.classList.add('duration-150')
        navLinks.classList.remove('hidden');
        setTimeout(function () {
            navLinks.classList.add('opacity-100', 'scale-100');
            navLinks.classList.remove('opacity-0', 'scale-95');
        }, 2);
    });

    navCloseButton.addEventListener('click', function () {
        navOpenButton.setAttribute('aria-expanded', "false");
        navLinks.classList.remove('duration-150', 'opacity-100', 'scale-100');
        navLinks.classList.add('duration-100', 'opacity-0', 'scale-95');

        setTimeout(function () {
            navLinks.classList.add('hidden');
        }, 150);
    });
};