import "./styles.scss";
const HOST = 'https://stage.savemo.app';

window.onload = () => {
    let navOpenButton = document.querySelector('#navOpenButton');
    let navLinks = document.querySelector('#navLinks');
    let navCloseButton = document.querySelector('#navCloseButton');

    let getAccessButtons = document.querySelectorAll('#getAccessHero, #getAccessBanner');

    navOpenButton.addEventListener('click', function () {
        navOpenButton.setAttribute('aria-expanded', "true");
        navLinks.classList.add('duration-150')
        navLinks.classList.remove('hidden');
        setTimeout(function () {
            navLinks.classList.add('opacity-100', 'scale-100');
            navLinks.classList.remove('opacity-0', 'scale-95');
        }, 2);
    });

    navCloseButton.addEventListener('click', () => {
        navOpenButton.setAttribute('aria-expanded', "false");
        navLinks.classList.remove('duration-150', 'opacity-100', 'scale-100');
        navLinks.classList.add('duration-100', 'opacity-0', 'scale-95');

        setTimeout(() => {
            navLinks.classList.add('hidden');
        }, 150);
    });

    getAccessButtons && getAccessButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            openModal(e.target, sendOtp);
        });
    });
};

function cleanupModal () {
    setModalLoader(false);
    setModalTitle(false);
    setModalInputArea(false);
    setModalInputPlaceHolder("");
    setModalInputValue("");
}

function openModal (targetElement, callBack) {
    console.log('Showing modal');

    let modal = document.querySelector('#modal');
    let overlay = document.querySelector('#modalOverlay');
    let modalCloseButton = document.querySelector('#closeModal');

    callBack && callBack(targetElement);

    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');

    modalCloseButton.addEventListener('click', function () {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');

        cleanupModal();

        modalCloseButton.removeEventListener('click', this);
    });
}

function setModalTitle (title) {
    let modalTitleNode = document.querySelector('#modalTitle');
    modalTitleNode.innerHTML = title;

    if (title)
        modalTitleNode.classList.remove('hidden');
    else
        modalTitleNode.classList.add('hidden');
}

function getModalUserInput () {
    return document.querySelector('#userInput').value;
}

function getInputValue (selector) {
    return document.querySelector(selector)?.value;
}

function setModalLoader (visibility) {
    if (visibility)
        document.querySelector('#modalLoader').classList.remove('hidden');
    else
        document.querySelector('#modalLoader').classList.add('hidden');
}

function setModalInputPlaceHolder (placeholderString) {
    document.querySelector("#userInput").setAttribute("placeholder", placeholderString);
}

function validatePhoneNumber (phoneNumber) {
    return /\d{10,10}/.test(phoneNumber);
}

function setModalErrorMessage (error) {
    let errorMessage = document.querySelector('#modalErrorMessage');
    errorMessage.innerHTML = error;

    if (error)
        errorMessage.classList.remove('hidden');
    else
        errorMessage.classList.add('hidden');
}

function setModalInputArea (visibility) {
    if (visibility) {
        document.querySelector('#inputArea').classList.remove('hidden');
    } else {
        document.querySelector('#inputArea').classList.add('hidden');
    }
}

function onSubmitButtonClicked (callBack) {
    const userInput = document.querySelector('#userInputSubmit');
    userInput.addEventListener('click', callBack);
}

function removeSubmitEventListener (fn) {
    const userInput = document.querySelector('#userInputSubmit');
    userInput.removeEventListener('click', fn);
}

function setModalInputValue (value) {
    document.querySelector('#userInput').value = value;
}

function sendOtp (target) {
    const targetInputSelector = `#${target.id}-input`;

    const phoneNumber = getInputValue(targetInputSelector);

    if (!validatePhoneNumber(phoneNumber)) {
        setModalTitle("Please enter a valid phone number and try again");
        return
    }

    setModalLoader(true);
    // let value = getModalUserInput();
    fetch(`${HOST}/waitlist/send_otp/${phoneNumber}`)
    .then(resp => resp.json())
    .then(resp => {
        setModalLoader(false);
        console.log(resp);

        if (resp.code === 2000) {
            collectOTP(phoneNumber);
        } else {
            setModalErrorMessage("Something went wrong from our side");
        }
    })
    .catch(resp => {
        setModalLoader(false);
        setModalErrorMessage("Something went wrong. Failed to submit phone number");
    });
}

function collectOTP (phoneNumber) {
    setModalTitle("Let's verify your number");
    setModalInputArea(true);
    setModalInputPlaceHolder("OTP");

    onSubmitButtonClicked(function () {
        const otp = getModalUserInput();

        if (otp) {
            verifyOTP(otp, phoneNumber);
            removeSubmitEventListener(this);
        } else {
            setModalErrorMessage("Invalid OTP");
        }
    });
}


function verifyOTP (otp, phoneNumber) {
    const currentLocation = new URL(window.location);
    const params = currentLocation.searchParams;
    const payload = {
        otp,
        utm_campaign: params.get('utm_campaign'),
        utm_medium: params.get('utm_medium'),
        utm_source: params.get('utm_source')
    };

    setModalLoader(true);

    fetch(`${HOST}/waitlist/${phoneNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(resp => resp.json())
    .then(resp => {
        setModalLoader(false);

        console.log(resp);        
        if (resp.code === 2000) {
            if (!resp.data?.user?.email) {
                collectEmail(phoneNumber, resp.data.token);
            } else {
                thankUser();
            }
        } else {
            setModalErrorMessage("Invalid OTP");
        }
    })
    .catch(() => {
        setModalLoader(false);
        setModalErrorMessage("Something went wrong while submitting OTP");
    });
}

function collectEmail (phoneNumber, token) {
    setModalTitle("Email");
    setModalErrorMessage("");
    setModalInputValue("");

    setModalInputPlaceHolder("Email");

    onSubmitButtonClicked(function () {
        const email = getModalUserInput();

        if (email) {
            submitEmail(email, phoneNumber, token);
            removeSubmitEventListener(this);
        } else {
            setModalErrorMessage("Invalid email");
        }
    });
}

function submitEmail (email, phoneNumber, token) {
    const payload = {
        token
    };

    setModalLoader(true);

    fetch(`${HOST}/${phoneNumber}/${window.encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.code === 2000) {
            thankUser();
        } else {
            setModalErrorMessage("Error while submitting email");
        }
    })
}

function thankUser () {
    setModalInputArea(false);
    setModalErrorMessage("");
    setModalTitle("You've been added to the waiting list");
}