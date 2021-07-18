import "./styles.scss";
console.log("hello world!");

window.onload = function () {
    var navOpenButton = document.querySelector('#navOpenButton');
    var navLinks = document.querySelector('#navLinks');
    var navCloseButton = document.querySelector('#navCloseButton');

    navOpenButton.addEventListener('click', function () {
        navOpenButton.setAttribute('aria-expanded', "true");
        navLinks.classList.remove('hidden', 'opacity-0');
        navLinks.classList.add('opacity-100', 'scale-100')
    });

    navCloseButton.addEventListener('click', function () {
        navOpenButton.setAttribute('aria-expanded', "false");
        navLinks.classList.add('hidden');
    });
};