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
                Validators.maxLength(12),
                CustomValidators.phone()
            ]),
        },
        [
            CustomValidators.match('password', 'password_confirmation', 'Şifreler eşleşmiyor')
        ]
    );

    constructor(private formBuilder: FormBuilder, public laravelError: LaravelFormErrorService) {
        this.formGroup = this.formBuilder.group({
            ad: ['', Validators.required],
            email: ['', Validators.required]
        });
    }

    // https://demo.abs.akdeniz.edu.tr/api/v1/register/ogrenci
}
