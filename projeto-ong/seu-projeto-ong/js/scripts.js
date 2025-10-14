document.addEventListener('DOMContentLoaded', () => {
    const applyMask = (element, maskFunction) => {
        element.addEventListener('input', (e) => {
            e.target.value = maskFunction(e.target.value);
        });
    };

    // Máscara de CPF: 000.000.000-00
    const cpfMask = (value) => {
        return value
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o sexto e o sétimo dígitos
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca um hífen antes dos dois últimos dígitos
    };

    // Máscara de Telefone: (00) 00000-0000
    const phoneMask = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d{4})$/, '$1-$2');
    };

    // Máscara de CEP: 00000-000
    const cepMask = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d{3})$/, '$1-$2');
    };

    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');

    if (cpfInput) applyMask(cpfInput, cpfMask);
    if (phoneInput) applyMask(phoneInput, phoneMask);
    if (cepInput) applyMask(cepInput, cepMask);
});
