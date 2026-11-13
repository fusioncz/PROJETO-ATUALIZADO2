document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".cadastro-form");

    if (!form) return;

    // Seleção dos campos do formulário
    const inputNome = document.getElementById("nome");
    const inputDataNascimento = document.getElementById("data-nascimento");
    const selectSexo = document.getElementById("sexo");
    const inputNomeMaterno = document.getElementById("nome-materno");
    const inputCpf = document.getElementById("cpf");
    const inputCelular = document.getElementById("celular");
    const inputTelefone = document.getElementById("telefone");
    const inputCep = document.getElementById("cep");
    const inputEndereco = document.getElementById("endereco");
    const inputNumero = document.getElementById("numero");
    const inputLogin = document.getElementById("login");
    const inputSenha = document.getElementById("senha");
    const inputConfirmaSenha = document.getElementById("confirma-senha");

    // ============================================================
    // CRIÇÃO ELEMENTO DE ERRO DE SENHA (VISUAL)
    // ============================================================
    const erroSenhaSpan = document.createElement("small");
    erroSenhaSpan.className = "erro-senha-msg";
    erroSenhaSpan.style.color = "#ff4d4d";
    erroSenhaSpan.style.fontSize = "0.72rem";
    erroSenhaSpan.style.marginTop = "4px";
    erroSenhaSpan.style.display = "none";
    erroSenhaSpan.style.fontWeight = "600";
    erroSenhaSpan.innerText = "As senhas não coincidem!";

    if (inputConfirmaSenha && inputConfirmaSenha.parentElement) {
        inputConfirmaSenha.parentElement.appendChild(erroSenhaSpan);
    }

    // ============================================================
    // VALIDAÇÕES EM TEMPO REAL: APENAS LETRAS
    // ============================================================

    // Permite apenas letras (incluindo acentos) e espaços
    const filtrarApenasLetras = (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Zà-úÀ-Ú\s]/g, "");
    };

    if (inputNome) inputNome.addEventListener("input", filtrarApenasLetras);
    if (inputNomeMaterno) inputNomeMaterno.addEventListener("input", filtrarApenasLetras);

    if (inputNumero) {
        inputNumero.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "");
        });
    }

    // ============================================================
    // MÁSCARAS E APENAS NÚMEROS (CPF, CEP, CELULAR, TELEFONE)
    // ============================================================

    // CPF: 000.000.000-00
    if (inputCpf) {
        inputCpf.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });
    }

    // CEP: 00000-000 e Autopreenchimento do Endereço via ViaCEP
    if (inputCep) {
        inputCep.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 8) v = v.slice(0, 8);
            if (v.length > 5) {
                v = v.replace(/(\d{5})(\d{1,3})/, "$1-$2");
            }
            e.target.value = v;

            const cepLimpo = v.replace(/\D/g, "");
            if (cepLimpo.length === 8) {
                fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.erro) {
                            inputEndereco.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                            if (inputNumero) inputNumero.focus();
                        } else {
                            alert("CEP não encontrado. Verifique o número digitado.");
                            if (inputEndereco) inputEndereco.value = "";
                            inputCep.focus();
                        }
                    })
                    .catch(() => {
                        console.log("Erro ao buscar CEP");
                        alert("Erro ao conectar com o serviço de CEP.");
                    });
            }
        });
    }

    // Celular: (+55)21-999999999
    if (inputCelular) {
        inputCelular.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 13) v = v.slice(0, 13);
            
            if (v.startsWith("55")) {
                const ddd = v.slice(2, 4);
                const num = v.slice(4, 13);
                v = `(+55)${ddd}${num ? "-" + num : ""}`;
            } else {
                if (v.length > 11) v = v.slice(0, 11);
                if (v.length > 2) {
                    v = `(+55)${v.slice(0, 2)}-${v.slice(2)}`;
                } else if (v.length > 0) {
                    v = `(+55)${v}`;
                }
            }
            e.target.value = v;
        });
    }

    // Telefone Fixo: (+55)21-22223333
    if (inputTelefone) {
        inputTelefone.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 12) v = v.slice(0, 12);

            if (v.startsWith("55")) {
                const ddd = v.slice(2, 4);
                const num = v.slice(4, 12);
                v = `(+55)${ddd}${num ? "-" + num : ""}`;
            } else {
                if (v.length > 10) v = v.slice(0, 10);
                if (v.length > 2) {
                    v = `(+55)${v.slice(0, 2)}-${v.slice(2)}`;
                } else if (v.length > 0) {
                    v = `(+55)${v}`;
                }
            }
            e.target.value = v;
        });
    }

    // ============================================================
    // VALIDAÇÃO VISUAL DE SENHAS COINCIDENTES
    // ============================================================
    function ChecarSenhas() {
        if (!inputSenha || !inputConfirmaSenha) return true;

        const senhaVal = inputSenha.value;
        const confirmaVal = inputConfirmaSenha.value;

        if (confirmaVal.length > 0 && senhaVal !== confirmaVal) {
            erroSenhaSpan.style.display = "block";
            inputConfirmaSenha.style.borderColor = "#ff4d4d";
            return false;
        } else {
            erroSenhaSpan.style.display = "none";
            inputConfirmaSenha.style.borderColor = "";
            return true;
        }
    }

    if (inputSenha) inputSenha.addEventListener("input", ChecarSenhas);
    if (inputConfirmaSenha) inputConfirmaSenha.addEventListener("input", ChecarSenhas);

    // Função para formatar a data AAAA-MM-DD para DD/MM/AAAA
    function formatarDataBR(dataISO) {
        if (!dataISO) return "";
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    // ============================================================
    // SALVAMENTO NO LOCALSTORAGE
    // ============================================================

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Validação da Confirmação de Senha
        if (!ChecarSenhas() || inputSenha.value !== inputConfirmaSenha.value) {
            alert("As senhas não coincidem. Por favor, verifique a senha digitada.");
            erroSenhaSpan.style.display = "block";
            inputConfirmaSenha.focus();
            return;
        }

        // Montagem do objeto de usuário
        const usuario = {
            nome: inputNome.value.trim(),
            dataNascimento: formatarDataBR(inputDataNascimento.value),
            sexo: selectSexo.value,
            nomeMaterno: inputNomeMaterno.value.trim(),
            cpf: inputCpf.value.trim(),
            celular: inputCelular.value.trim(),
            telefone: inputTelefone.value.trim(),
            cep: inputCep.value.trim(),
            endereco: inputEndereco.value.trim(),
            numero: inputNumero.value.trim(),
            login: inputLogin.value.trim(),
            senha: inputSenha.value,
            dataCadastro: new Date().toISOString()
        };

        const cadastrosExistentes = JSON.parse(localStorage.getItem("usuarios_cadastrados")) || [];

        const usuarioExiste = cadastrosExistentes.some(
            (user) => user.login === usuario.login || user.cpf === usuario.cpf
        );

        if (usuarioExiste) {
            alert("Este Login ou CPF já está cadastrado!");
            return;
        }

        cadastrosExistentes.push(usuario);
        localStorage.setItem("usuarios_cadastrados", JSON.stringify(cadastrosExistentes));

        alert("Cadastro realizado com sucesso!");
        form.reset();
        erroSenhaSpan.style.display = "none";
        inputConfirmaSenha.style.borderColor = "";
    });
});
