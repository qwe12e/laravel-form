import {AbstractControl, FormGroup, Validators} from '@angular/forms';

export class CustomValidators {

    private static removeError(control: AbstractControl, errorKey) {
        if (control.errors && control.errors[errorKey]) {
            delete control.errors[errorKey];
            if (Object.keys(control.errors).length === 0) {
                control.setErrors(undefined);
            } else {
                control.setErrors(control.errors);
            }
        }
    }

    private static appendError(control, errorKey, errorBody) {
        if (!control.errors) {
            control.setErrors({[errorKey]: errorBody});
        } else {
            control.errors[errorKey] = errorBody;
            control.setErrors(control.errors);
        }
    }

    static pattern(pattern: string, message: string) {
        return function (control: AbstractControl) {
            if (!control) {
                return;
            }
            const error = Validators.pattern(pattern)(control);
            if (!error) {
                return;
            }
            error.pattern['message'] = message;
            const ret = {
                customPattern: error.pattern
            };
            return ret;
        };
    }

    static match(formControlName1: string, formControlName2: string, message?: string) {
        return function (control: AbstractControl) {
            if (!control || !control.get || typeof control.get !== 'function') {
                return;
            }
            const control1 = control.get(formControlName1);
            const control2 = control.get(formControlName2);
            if (!control1 || !control2) {
                return;
            }

            if (!control1.dirty || !control2.dirty) {
                return;
            }

            if (control1.value === control2.value) {
                CustomValidators.removeError(control1, 'match');
                CustomValidators.removeError(control2, 'match');
                return;
            }
            const err = {
                [formControlName1]: control1.value,
                [formControlName2]: control2.value,
                message: message
            };

            CustomValidators.appendError(control1, 'match', err);
            CustomValidators.appendError(control2, 'match', err);
            return null;
        };
    }

    static phone() {
        return function (control: AbstractControl) {
            if (!control) {
                return;
            }
            let val = '' + control.value;
            if (val.length > 0) {
                const rexp = /0\([0-9 ]{3}\) [0-9 ]{3} [0-9 ]{4}/;
                if (!rexp.test(val)) {
                    if (val.startsWith('0')) {
                        val = val.substring(1);
                    }
                    val = val.replace('(', '');
                    val = val.replace(')', '');
                    val = val.replace(' ', '');
                    val = val.padEnd(10, ' ');
                    console.log('.' + val + '.');
                    // this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
                    val = '0(' + val.slice(0, 3) + ') ' + val.slice(3, 6) + ' ' + val.slice(6, 10);
                    console.log(val);
                    control.setValue(val);
                }
            }
            return null;
        };
    }
}
