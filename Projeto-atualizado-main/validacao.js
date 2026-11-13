document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    if (!form) return;

    const fields = form.querySelectorAll('input:not([type="checkbox"]), select');

    fields.forEach(field => {
        const formGroup = field.closest('.form-group');
        const smallDesc = formGroup ? formGroup.querySelector('small') : null;
        if (smallDesc && !smallDesc.dataset.defaultText) {
            smallDesc.dataset.defaultText = smallDesc.textContent.trim();
        }

        // Valida enquanto digita
        field.addEventListener('input', () => {
            // Máscara simples para CPF
            if (field.id === 'cpf') {
                let v = field.value.replace(/\D/g, '').slice(0, 11);
                v = v.replace(/(\d{3})(\d)/, '$1.$2');
                v = v.replace(/(\d{3})(\d)/, '$1.$2');
                v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                field.value = v;
            }

            // Máscara e consulta automática ViaCEP para CEP
            if (field.id === 'cep') {
                let cep = field.value.replace(/\D/g, '').slice(0, 8);
                if (cep.length > 5) {
                    field.value = cep.slice(0, 5) + '-' + cep.slice(5);
                } else {
                    field.value = cep;
                }

                if (cep.length === 8) {
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        .then(res => res.json())
                        .then(data => {
                            const endField = document.getElementById('endereco');
                            if (!data.erro && endField) {
                                endField.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                                validateField(endField);
                            }
                        })
                        .catch(() => {});
                }
            }

            validateField(field);

            // Revalida confirmação de senha quando a senha principal mudar
            if (field.id === 'senha' || field.name === 'senha') {
                const confirmInput = form.querySelector('#confirmar_senha, #confirmar-senha, [name="confirmar_senha"]');
                if (confirmInput && confirmInput.value.trim() !== '') {
                    validateField(confirmInput);
                }
            }
        });

        field.addEventListener('change', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });

    function validateField(field) {
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        const smallDesc = formGroup ? formGroup.querySelector('small') : null;

        if (value === '') {
            field.classList.remove('is-valid', 'is-invalid');
            if (smallDesc) {
                smallDesc.textContent = smallDesc.dataset.defaultText || '';
                smallDesc.classList.remove('error-feedback', 'success-feedback');
            }
            return true;
        }

        // Validação de CPF (11 dígitos)
        if (field.id === 'cpf') {
            const digits = value.replace(/\D/g, '');
            if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
                setFieldError(field, smallDesc, 'CPF inválido. Informe os 11 dígitos.');
                return false;
            }
        }

        // Validação de Confirmação de Senha
        if (field.id === 'confirmar_senha' || field.id === 'confirmar-senha' || field.name === 'confirmar_senha') {
            const passwordField = form.querySelector('#senha, [name="senha"]');
            if (passwordField && value !== passwordField.value.trim()) {
                setFieldError(field, smallDesc, 'As senhas não coincidem.');
                return false;
            }
        }

        if (field.checkValidity()) {
            setFieldSuccess(field, smallDesc);
            return true;
        } else {
            let customMessage = field.validationMessage;

            if (field.validity.patternMismatch) {
                if (field.id === 'login') {
                    customMessage = 'O login deve conter exatamente 6 letras (sem números ou símbolos).';
                } else if (field.id === 'senha') {
                    customMessage = 'A senha deve conter exatamente 8 letras (sem números ou símbolos).';
                }
            } else if (field.validity.tooShort) {
                customMessage = `Mínimo de ${field.minLength} caracteres exigidos.`;
            }

            setFieldError(field, smallDesc, customMessage);
            return false;
        }
    }

    function setFieldSuccess(field, smallDesc) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        if (smallDesc) {
            smallDesc.textContent = '✓ Preenchido corretamente';
            smallDesc.classList.remove('error-feedback');
            smallDesc.classList.add('success-feedback');
        }
    }

    function setFieldError(field, smallDesc, message) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        if (smallDesc) {
            smallDesc.textContent = message;
            smallDesc.classList.remove('success-feedback');
            smallDesc.classList.add('error-feedback');
        }
    }

    form.addEventListener('submit', (e) => {
        let formIsValid = true;

        fields.forEach(field => {
            if (!validateField(field) || !field.checkValidity()) {
                formIsValid = false;
            }
        });

        if (!formIsValid) {
            e.preventDefault();
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
        }
    });
});