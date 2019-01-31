const errorCases = {
    'required': 'Doldur',
    'email': 'Hatalı E-Posta',
    'minlength': errBody => errBody.requiredLength + ' karakter olmalı.',
    'customPattern': errBody => errBody.message,
    'match': errBody => errBody.message ? errBody.message : 'Değerler eşleşmiyor.',
};

export function printErrors(errors): string {
    console.log('aaa', errors);
    const result = [];
    for (const [error, message] of Object.entries(errors)) {
        if (error.startsWith('laravel')) {
            result.push(message);
        } else {
            if (errorCases[error]) {
                if (typeof errorCases[error] === 'function') {
                    result.push(errorCases[error](message));
                } else {
                    result.push(errorCases[error]);
                }
            } else {
                result.push('Hata (' + error + ')');
            }
            /*switch (error) {
                case 'required' :
                    result.push('Doldur');
                    break;
                case 'minlength' :
                    result.push('Yanlış Email');
                    break;
                case 'email' :
                    result.push('Yanlış Email');
                    break;
                case 'asd' :
                    result.push('asd');
                    break;
                default:
                    result.push('Bilinmeyen Hata');
            }*/
        }
    }
    return result.join('<br>');

}
