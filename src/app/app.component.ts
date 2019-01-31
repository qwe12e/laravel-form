import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LaravelFormErrorService} from './laravel-form-error.service';
import {CustomValidators} from './laravel-form/laravel-form.validators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    formGroup: FormGroup;


    formGroup1: FormGroup;
    formGroup2: FormGroup;

    deneme = new FormControl(3.56565656);
    deneme2 = new FormControl(3.56565656);

    mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    file;
    loginFormGroup = new FormGroup({
        tc: new FormControl(0, [Validators.required]),
        password: new FormControl()
    });

    kayitFormGroup = new FormGroup({
            tc: new FormControl('', [Validators.required,
                CustomValidators.pattern('[0-9]{11}', 'Geçerli bir T.C. Kimlik No giriniz'),
            ]),
            name: new FormControl('', [Validators.required]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ]),
            password_confirmation: new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ]),
            email: new FormControl('', [Validators.required, Validators.email]),
            tel: new FormControl('', [Validators.required,
                Validators.minLength(10),
                Validators.maxLength(14),
            ]),
        },
        [
            CustomValidators.match('password', 'password_confirmation', 'Şifreler eşleşmiyor')
        ]
    );

    constructor(private formBuilder: FormBuilder, public laravelError: LaravelFormErrorService) {
        this.formGroup1 = new FormGroup({
            a: this.deneme
        });
        this.formGroup2 = new FormGroup({
            b: this.deneme
        });
        this.formGroup = this.formBuilder.group({
            ad: ['', Validators.required],
            email: ['', Validators.required]
        });
    }


    f1(value, targetFormControl: FormControl) {
        console.log('f1', value);
        console.log('f1', targetFormControl);
        return Math.round(value * 100) / 100;
    }

    f2(value, targetFormControl: FormControl) {
        console.log('f2', value);
        console.log('f2', targetFormControl);
        return Math.round(value * 100) / 100;
    }

    // https://demo.abs.akdeniz.edu.tr/api/v1/register/ogrenci
    log() {
        console.log(this.formGroup1);
    }
}
