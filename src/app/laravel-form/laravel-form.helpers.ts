export function printErrors(errors): string {
    const result = [];
    for (const [error, message] of Object.entries(errors)) {
        if (error.startsWith('laravel')) {
            result.push(message);
        } else {
            switch (error) {
                case 'required' :
                    result.push('Doldur');
                    break;
                case 'email' :
                    result.push('Yanlış Email');
                    break;
                case 'asd' :
                    result.push('asd');
                    break;
                default:
                    result.push('Bilinmeyen Hata');
            }
        }
    }
    return result.join('<br>');

}
