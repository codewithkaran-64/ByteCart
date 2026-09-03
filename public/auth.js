// ==========================
// SHOW / HIDE PASSWORD
// ==========================

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;

        const input = document.getElementById(targetId);

        if (!input) {
            return;
        }

        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";

        button.textContent = isHidden ? "🙈" : "👁";

        button.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );
    });
});


// ==========================
// FIELD VALIDATION HELPERS
// ==========================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function setFieldState(input, errorEl, message) {

    if (!input) {
        return;
    }

    if (message) {

        input.classList.remove("valid");
        input.classList.add("invalid");

        if (errorEl) errorEl.textContent = message;

    } else {

        input.classList.remove("invalid");
        input.classList.add("valid");

        if (errorEl) errorEl.textContent = "";
    }
}


function validateName(input, errorEl) {

    const value = input.value.trim();

    if (value.length === 0) {

        setFieldState(input, errorEl, "");

        return false;
    }

    if (value.length < 2) {

        setFieldState(input, errorEl, "Name looks too short.");

        return false;
    }

    setFieldState(input, errorEl, null);

    return true;
}


function validateEmail(input, errorEl) {

    const value = input.value.trim();

    if (value.length === 0) {

        setFieldState(input, errorEl, "");

        return false;
    }

    if (!EMAIL_REGEX.test(value)) {

        setFieldState(input, errorEl, "Enter a valid email address.");

        return false;
    }

    setFieldState(input, errorEl, null);

    return true;
}


function validateLoginPassword(input, errorEl) {

    const value = input.value;

    if (value.length === 0) {

        setFieldState(input, errorEl, "");

        return false;
    }

    setFieldState(input, errorEl, null);

    return true;
}


function validateNewPassword(input, errorEl) {

    const value = input.value;

    if (value.length === 0) {

        setFieldState(input, errorEl, "");

        return false;
    }

    if (value.length < 6) {

        setFieldState(input, errorEl, "Use at least 6 characters.");

        return false;
    }

    setFieldState(input, errorEl, null);

    return true;
}


// ==========================
// PASSWORD STRENGTH METER
// (used on the register page only)
// ==========================

function calculatePasswordStrength(password) {

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score; // 0 - 5
}


function updateStrengthMeter(password) {

    const bar = document.getElementById("strengthBar");

    const label = document.getElementById("strengthLabel");

    if (!bar || !label) {
        return;
    }

    if (password.length === 0) {

        bar.style.width = "0%";

        label.textContent = "";

        return;
    }

    const score = calculatePasswordStrength(password);

    const percent = Math.min(100, (score / 5) * 100);

    bar.style.width = percent + "%";

    if (score <= 1) {

        bar.style.background = "#e74c3c";

        label.textContent = "Weak password";

        label.style.color = "#e74c3c";

    } else if (score <= 3) {

        bar.style.background = "#f39c12";

        label.textContent = "Okay password";

        label.style.color = "#f39c12";

    } else {

        bar.style.background = "#27ae60";

        label.textContent = "Strong password";

        label.style.color = "#27ae60";
    }
}


// ==========================
// LOGIN
// ==========================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    emailInput.addEventListener("input", () =>
        validateEmail(emailInput, emailError));

    passwordInput.addEventListener("input", () =>
        validateLoginPassword(passwordInput, passwordError));


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const emailValid = validateEmail(emailInput, emailError);
            const passwordValid = validateLoginPassword(passwordInput, passwordError);

            if (!emailValid || !passwordValid) {
                return;
            }


            const email = emailInput.value.trim();
            const password = passwordInput.value;


            const message =
                document.getElementById(
                    "message"
                );

            const submitButton =
                document.getElementById("submitButton");

            const buttonText =
                submitButton.querySelector(".button-text");


            message.textContent = "";

            submitButton.disabled = true;

            buttonText.textContent = "";

            submitButton.insertAdjacentHTML(
                "beforeend",
                '<span class="button-spinner"></span>'
            );


            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const result =
                    await response.json();


                if (response.ok) {

                    message.textContent =
                        "Login successful! Redirecting...";

                    message.style.color =
                        "green";


                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 700);

                } else {

                    message.textContent =
                        result.message;

                    message.style.color =
                        "red";

                    submitButton.disabled = false;

                    submitButton.querySelector(".button-spinner")?.remove();

                    buttonText.textContent = "Login";
                }

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Could not connect to server.";

                message.style.color =
                    "red";

                submitButton.disabled = false;

                submitButton.querySelector(".button-spinner")?.remove();

                buttonText.textContent = "Login";
            }
        }
    );
}



// ==========================
// REGISTER
// ==========================

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    nameInput.addEventListener("input", () =>
        validateName(nameInput, nameError));

    emailInput.addEventListener("input", () =>
        validateEmail(emailInput, emailError));

    passwordInput.addEventListener("input", () => {

        validateNewPassword(passwordInput, passwordError);

        updateStrengthMeter(passwordInput.value);
    });


    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const nameValid = validateName(nameInput, nameError);
            const emailValid = validateEmail(emailInput, emailError);
            const passwordValid = validateNewPassword(passwordInput, passwordError);

            if (!nameValid || !emailValid || !passwordValid) {
                return;
            }


            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;


            const message =
                document.getElementById(
                    "message"
                );

            const submitButton =
                document.getElementById("submitButton");

            const buttonText =
                submitButton.querySelector(".button-text");


            message.textContent = "";

            submitButton.disabled = true;

            buttonText.textContent = "";

            submitButton.insertAdjacentHTML(
                "beforeend",
                '<span class="button-spinner"></span>'
            );


            try {

                const response =
                    await fetch(
                        "/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })
                        }
                    );


                const result =
                    await response.json();


                if (response.ok) {

                    message.textContent =
                        "Account created! Redirecting to login...";

                    message.style.color =
                        "green";


                    setTimeout(() => {

                        window.location.href =
                            "login.html";

                    }, 1000);

                } else {

                    message.textContent =
                        result.message;

                    message.style.color =
                        "red";

                    submitButton.disabled = false;

                    submitButton.querySelector(".button-spinner")?.remove();

                    buttonText.textContent = "Create Account";
                }

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Could not connect to server.";

                message.style.color =
                    "red";

                submitButton.disabled = false;

                submitButton.querySelector(".button-spinner")?.remove();

                buttonText.textContent = "Create Account";
            }
        }
    );
}
