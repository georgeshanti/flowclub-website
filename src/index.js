import "./styles.scss";
const HOST = 'https://stage.savemo.app';

window.onload = () => {
    let navOpenButton = document.querySelector('#navOpenButton');
    let navLinks = document.querySelector('#navLinks');
    let navCloseButton = document.querySelector('#navCloseButton');

    let getAccessForms = document.querySelectorAll('#getAccessHero, #getAccessBanner1, #getAccessBanner2');

    navOpenButton.addEventListener('click', function () {
        navOpenButton.setAttribute('aria-expanded', "true");
        navLinks.classList.add('duration-150', 'ease-out')
        navLinks.classList.remove('hidden');
        setTimeout(function () {
            navLinks.classList.add('opacity-100', 'scale-100');
            navLinks.classList.remove('opacity-0', 'scale-95');
        }, 2);
    });

    navCloseButton.addEventListener('click', () => {
        navOpenButton.setAttribute('aria-expanded', "false");
        navLinks.classList.remove('duration-150', 'ease-out', 'opacity-100', 'scale-100');
        navLinks.classList.add('duration-100', 'ease-in', 'opacity-0', 'scale-95');

        setTimeout(() => {
            navLinks.classList.add('hidden');
        }, 150);
    });

    getAccessForms && getAccessForms.forEach((button) => {
        button.addEventListener('submit', (e) => {
            e.preventDefault();
            openModal(e.target, sendOtp);
        });
    });
};

let modalClose, phoneNumberTextBox;

function cleanupModal () {
    setModalLoader(false);
    setModalTitle(false);
    setModalInputArea(false);
    setModalInputPlaceHolder("");
    setModalInputValue("");
    setModalInfoMessage("");
    setModalErrorMessage("");
}

function openModal (targetElement, callBack) {
    let modal = document.querySelector('#modal');
    let overlay = document.querySelector('#modalOverlay');
    let modalCloseButton = document.querySelector('#closeModal');

    phoneNumberTextBox = targetElement;

    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');

    setTimeout(() => {
        modal.classList.add('duration-150', 'ease-out', 'opacity-100', 'scale-100');
        overlay.classList.add('duration-150', 'ease-out', 'opacity-80');

        modal.classList.remove('opacity-0', 'scale-95');
        overlay.classList.remove('opacity-0');
    }, 2);

    modalClose = () => {

        modal.classList.remove('opacity-100', 'scale-100', 'duration-150', 'ease-out');
        overlay.classList.remove('opacity-80', 'duration-150', 'ease-out');

        modal.classList.add('duration-100', 'ease-in', 'opacity-0', 'scale-95');
        overlay.classList.add('duration-100', 'ease-in', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            overlay.classList.add('hidden');

            let originalElement = document.querySelector("#modal");
            let clonedElement = originalElement.cloneNode(true);
            originalElement.parentNode.replaceChild(clonedElement, originalElement);
        }, 150);

        cleanupModal();

        modalCloseButton.removeEventListener('click', modalClose);
    };

    modalCloseButton.addEventListener('click', modalClose);

    callBack && callBack(targetElement);

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
    return phoneNumber && /^\d{10,10}$/.test(phoneNumber.trim());
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
    userInput.addEventListener('submit', callBack);
}

function removeSubmitEventListener (fn) {
    const userInput = document.querySelector('#userInputSubmit');
    userInput.removeEventListener('submit', fn);
}

function setModalInputValue (value) {
    document.querySelector('#userInput').value = value;
}

function setModalInfoMessage (message) {
    const messageArea = document.querySelector('#modalMessage');
    messageArea.innerHTML = message;

    if (message) {
        messageArea.classList.remove('hidden');
    } else {
        messageArea.classList.add('hidden');
    }
}

function sendOtp (target) {
    const targetInputSelector = `#${target.id}-input`;

    const phoneNumber = getInputValue(targetInputSelector);

    if (!validatePhoneNumber(phoneNumber)) {
        setModalTitle("Please enter a valid phone number and try again");
        return
    }

    setModalLoader(true);

    fetch(`${HOST}/waitlist/send_otp/${phoneNumber}`)
    .then(resp => resp.json())
    .then(resp => {
        setModalLoader(false);
        console.log(resp);

        if (resp.code === 2000) {
            collectOTP(phoneNumber);

            return true;
        } else {
            setModalErrorMessage("Something went wrong from our end. Please try again later");
        }
    })
    .catch(resp => {
        setModalLoader(false);
        setModalErrorMessage("Something went wrong. Failed to submit phone number");
    });
}

function validateOTP (otp) {
    return otp && /^\d{4,4}$/.test(otp.trim());
}

function collectOTP (phoneNumber) {
    setModalTitle("Let's verify your number");
    setModalInputArea(true);
    setModalInputPlaceHolder("OTP");

    const onOTPSubmitCallback = (e) => {
        e.preventDefault();
        const otp = getModalUserInput();

        if (validateOTP(otp)) {
            verifyOTP(otp, phoneNumber)
            .then((isSuccessful) => {
                isSuccessful && removeSubmitEventListener(onOTPSubmitCallback);
            });
        } else {
            setModalErrorMessage("Invalid OTP");
        }
    };

    onSubmitButtonClicked(onOTPSubmitCallback);
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

    setModalInputArea(false);
    setModalLoader(true);

    return fetch(`${HOST}/waitlist/${phoneNumber}`, {
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
            
            return true;
        } else {
            setModalInputArea(true);
            setModalErrorMessage("Invalid OTP");
        }
    })
    .catch(() => {
        setModalLoader(false);
        setModalInputArea(true);
        setModalErrorMessage("Something went wrong while submitting OTP");
    });
}

function validateEmail (email) {
    return email && /^.+@.+$/.test(email);
}

function collectEmail (phoneNumber, token) {
    setModalTitle("Email");
    setModalInputArea(true);
    setModalErrorMessage("");
    setModalInputValue("");

    setModalInputPlaceHolder("Email");

    const onEmailSubmitCallback = (e) => {
        e.preventDefault();
        const email = getModalUserInput();

        if (validateEmail(email)) {
            submitEmail(email, phoneNumber, token)
            .then((isSuccessful) => {
                isSuccessful && removeSubmitEventListener(onEmailSubmitCallback);
            });
        } else {
            setModalErrorMessage("Invalid email");
        }
    };

    onSubmitButtonClicked(onEmailSubmitCallback);
}

function submitEmail (email, phoneNumber, token) {
    const payload = {
        token
    };

    setModalInputArea(false);
    setModalLoader(true);

    return fetch(`${HOST}/waitlist/${phoneNumber}/${window.encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(resp => resp.json())
    .then(resp => {
        setModalLoader(false);
        if (resp.code === 2000) {
            thankUser();

            return true;
        } else {
            setModalInputArea(true);
            setModalErrorMessage("Error while submitting email");
        }
    })
    .catch(() => {
        setModalInputArea(true);
        setModalLoader(false)
        setModalErrorMessage("Failed to submit email")
    });
}

function thankUser () {
    setModalInputArea(false);
    setModalErrorMessage("");
    setModalTitle("All done!");
    setModalInfoMessage("You've been added to the waitlist");

    if(phoneNumberTextBox) {
        // Clear phone number after everything is successful
        const selector = `#${phoneNumberTextBox.id}-input`;
        const inputNode = document.querySelector(selector);

        if (inputNode) {
            inputNode.value = "";
        }
    }

    setTimeout(() => {
        
        modalClose && modalClose();
    }, 3000);
}