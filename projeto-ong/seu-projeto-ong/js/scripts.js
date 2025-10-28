// MÓDULO 1: SISTEMA DE SPA (Single Page Application)
// ============================================
const SPA = {
    currentPage: 'home',
    
    // Inicializa o sistema de SPA
    init() {
        this.setupNavigation();
        this.loadPage(this.currentPage);
    },
    
    // Configura a navegação entre páginas
    setupNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.loadPage(page);
            }
        });
        
        // Suporte para navegação com botões do navegador
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });
    },
    
    // Carrega uma página dinamicamente
    loadPage(pageName, updateHistory = true) {
        const content = Templates.render(pageName);
        const appContainer = document.getElementById('app-content');
        
        if (appContainer) {
            appContainer.innerHTML = content;
            this.currentPage = pageName;
            
            // Atualiza o histórico do navegador
            if (updateHistory) {
                history.pushState({ page: pageName }, '', `#${pageName}`);
            }
            
            // Reinicializa os formulários na nova página
            FormValidator.init();
        }
    }
};

// ============================================
// MÓDULO 2: SISTEMA DE TEMPLATES
// ============================================
const Templates = {
    // Banco de templates para diferentes páginas
    templates: {
        home: `
            <div class="page-home">
                <h1>Bem-vindo ao Sistema</h1>
                <p>Navegue pelo menu para acessar as funcionalidades.</p>
                <button data-page="formulario" class="btn-primary">Ir para Formulário</button>
            </div>
        `,
        
        formulario: `
            <div class="page-formulario">
                <h1>Cadastro de Usuário</h1>
                <form id="user-form" novalidate>
                    <div class="form-group">
                        <label for="nome">Nome Completo:</label>
                        <input type="text" id="nome" name="nome" required>                   
                        <span class="error-message" data-error="nome" aria-live="polite"></span>

                    </div>
                    
                    <div class="form-group">
                        <label for="cpf">CPF:</label>
                        <input type="text" id="cpf" name="cpf" maxlength="14" required>
                        <span class="error-message" data-error="nome" aria-live="polite"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="telefone">Telefone:</label>
                        <input type="text" id="telefone" name="telefone" maxlength="15" required>
                        <span class="error-message" data-error="nome" aria-live="polite"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="cep">CEP:</label>
                        <input type="text" id="cep" name="cep" maxlength="9" required>
                        <span class="error-message" data-error="cep"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">E-mail:</label>
                        <input type="email" id="email" name="email" required>
                        <span class="error-message" data-error="email"></span>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Enviar</button>
                        <button type="button" data-page="home" class="btn-secondary">Voltar</button>
                    </div>
                </form>
            </div>
        `,
        
        sobre: `
            <div class="page-sobre">
                <h1>Sobre o Projeto</h1>
                <p>Este é um projeto desenvolvido para a Entrega III, demonstrando:</p>
                <ul>
                    <li>Sistema de Single Page Application (SPA)</li>
                    <li>Sistema de Templates JavaScript</li>
                    <li>Validação de formulários com feedback ao usuário</li>
                    <li>Máscaras de entrada para formatação de dados</li>
                </ul>
                <button data-page="home" class="btn-secondary">Voltar</button>
            </div>
        `
    },
    
    // Renderiza um template específico
    render(templateName) {
        return this.templates[templateName] || this.templates.home;
    }
};

// ============================================
// MÓDULO 3: MÁSCARAS DE ENTRADA
// ============================================
const InputMasks = {
    // Aplica máscara a um elemento
    applyMask(element, maskFunction) {
        element.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = maskFunction(oldValue);
            
            e.target.value = newValue;
            
            // Mantém a posição do cursor
            if (newValue.length >= cursorPosition) {
                e.target.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    },
    
    // Máscara de CPF: 000.000.000-00
    cpfMask(value) {
        return value
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após 3 dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após 6 dígitos
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca hífen antes dos 2 últimos
    },
    
    // Máscara de Telefone: (00) 00000-0000
    phoneMask(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d{4})$/, '$1-$2');
    },
    
    // Máscara de CEP: 00000-000
    cepMask(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d{3})$/, '$1-$2');
    },
    
    // Inicializa as máscaras nos campos
    init() {
        const cpfInput = document.getElementById('cpf');
        const phoneInput = document.getElementById('telefone');
        const cepInput = document.getElementById('cep');
        
        if (cpfInput) this.applyMask(cpfInput, this.cpfMask);
        if (phoneInput) this.applyMask(phoneInput, this.phoneMask);
        if (cepInput) this.applyMask(cepInput, this.cepMask);
    }
};

// ============================================
// MÓDULO 4: VALIDAÇÃO DE FORMULÁRIOS
// ============================================
const FormValidator = {
    // Regras de validação
    validationRules: {
        nome: {
            required: true,
            minLength: 3,
            pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
            message: 'Nome deve conter apenas letras e ter no mínimo 3 caracteres.'
        },
        cpf: {
            required: true,
            validate: (value) => FormValidator.validateCPF(value),
            message: 'CPF inválido. Verifique os dígitos informados.'
        },
        telefone: {
            required: true,
            pattern: /^\(\d{2}\)\s\d{5}-\d{4}$/,
            message: 'Telefone deve estar no formato (00) 00000-0000.'
        },
        cep: {
            required: true,
            pattern: /^\d{5}-\d{3}$/,
            message: 'CEP deve estar no formato 00000-000.'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'E-mail inválido. Use o formato exemplo@dominio.com.'
        }
    },
    
    // Valida CPF (algoritmo oficial)
    validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }
        
        let sum = 0;
        let remainder;
        
        // Valida primeiro dígito verificador
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
        
        // Valida segundo dígito verificador
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    },
    
    // Valida um campo específico
    validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        // Verifica campo obrigatório
        if (rules.required && !fieldValue) {
            this.showError(field, 'Este campo é obrigatório.');
            return false;
        }
        
        // Verifica comprimento mínimo
        if (rules.minLength && fieldValue.length < rules.minLength) {
            this.showError(field, rules.message);
            return false;
        }
        
        // Verifica padrão regex
        if (rules.pattern && !rules.pattern.test(fieldValue)) {
            this.showError(field, rules.message);
            return false;
        }
        
        // Validação customizada
        if (rules.validate && !rules.validate(fieldValue)) {
            this.showError(field, rules.message);
            return false;
        }
        
        // Campo válido
        this.clearError(field);
        return true;
    },
    
    // Exibe mensagem de erro
    showError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        const errorElement = document.querySelector(`[data-error="${field.name}"]`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },
    
    // Remove mensagem de erro
    clearError(field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        
        const errorElement = document.querySelector(`[data-error="${field.name}"]`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    },
    
    // Valida o formulário completo
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], input[name]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    // Inicializa a validação
    init() {
        const form = document.getElementById('user-form');
        
        if (!form) return;
        
        // Inicializa as máscaras
        InputMasks.init();
        
        // Validação em tempo real (blur)
        form.addEventListener('blur', (e) => {
            if (e.target.matches('input')) {
                this.validateField(e.target);
            }
        }, true);
        
        // Validação no submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.handleFormSuccess(form);
            } else {
                this.handleFormError();
            }
        });
    },
    
    // Manipula sucesso do formulário
    handleFormSuccess(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Armazena no localStorage (simulação de persistência)
        localStorage.setItem('userData', JSON.stringify(data));
        
        alert('Formulário enviado com sucesso!\n\nDados salvos localmente.');
        form.reset();
        
        // Remove classes de validação
        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
    },
    
    // Manipula erro do formulário
    handleFormError() {
        alert('Por favor, corrija os erros no formulário antes de enviar.');
    }
};

// ============================================
// MÓDULO 5: INICIALIZAÇÃO DA APLICAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o sistema de SPA
    SPA.init();
    
    // Carrega página inicial baseada na URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        SPA.loadPage(hash);
    }
});
