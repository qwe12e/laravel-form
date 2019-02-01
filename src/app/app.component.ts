import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LaravelFormErrorService} from './laravel-form-error.service';
import {CustomValidators} from './laravel-form/laravel-form.validators';
import {distinctUntilChanged, pairwise, skipWhile, startWith} from 'rxjs/operators';

export function jsonEqual(a, b): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

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

  faturaFormGroup = new FormGroup({
    kdv_yuzde: new FormControl(/*8*/ /*, [Validators.required]*/),
    kdv_haric: new FormControl(/*0*/ /*, [Validators.required]*/),
    kdv_dahil: new FormControl(/*0*/ /*, [Validators.required]*/),
  });

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

    // this.faturaFormGroup.valueChanges
    //     //   .pipe(
    //     //     startWith(this.faturaFormGroup.value),
    //     //     distinctUntilChanged((a, b) => jsonEqual(a, b)),
    //     //     pairwise()
    //     //   )
    //     //   .subscribe(
    //     //     ([oncekiFatura, yeniFatura]) => {
    //     //       console.log('fatura değişti!', yeniFatura, oncekiFatura);
    //     //       if (oncekiFatura.kdv_yuzde !== yeniFatura.kdv_yuzde) {
    //     //         console.log('yuzde değişti', oncekiFatura.kdv_yuzde, '=>', yeniFatura.kdv_yuzde);
    //     //
    //     //       }
    //     //       if (oncekiFatura.kdv_haric !== yeniFatura.kdv_haric) {
    //     //         console.log('hariç değişti', oncekiFatura.kdv_haric, '=>', yeniFatura.kdv_haric);
    //     //
    //     //       }
    //     //       if (oncekiFatura.kdv_dahil !== yeniFatura.kdv_dahil) {
    //     //         console.log('dahil değişti', oncekiFatura.kdv_dahil, '=>', yeniFatura.kdv_dahil);
    //     //
    //     //       }
    //     //     }
    //     //   );

    let ignoreEvent = false;

    this.faturaFormGroup.get('kdv_yuzde').valueChanges.pipe(skipWhile(value => {
      if (ignoreEvent) {
        ignoreEvent = false;
        return true;
      }
      return false;
    })).subscribe(kdv_yuzde => {
      console.log('yüzde değişti');
      const yeniFatura = this.faturaFormGroup.value;
      ignoreEvent = true;
      this.faturaFormGroup.patchValue({kdv_haric: (yeniFatura.kdv_dahil * 100) / (100 + (yeniFatura.kdv_yuzde || 0))});
    });
    this.faturaFormGroup.get('kdv_haric').valueChanges.pipe(skipWhile(value => {
      if (ignoreEvent) {
        ignoreEvent = false;
        return true;
      }
      return false;
    })).subscribe(kdv_haric => {
      console.log('hariç değişti');
      const yeniFatura = this.faturaFormGroup.value;
      ignoreEvent = true;
      this.faturaFormGroup.patchValue({kdv_dahil: yeniFatura.kdv_haric * (100 + (yeniFatura.kdv_yuzde || 0)) / 100});
    });
    this.faturaFormGroup.get('kdv_dahil').valueChanges.pipe(skipWhile(value => {
      if (ignoreEvent) {
        ignoreEvent = false;
        return true;
      }
      return false;
    })).subscribe(kdv_dahil => {
      const yeniFatura = this.faturaFormGroup.value;
      console.log('dahil değişti', yeniFatura);
      ignoreEvent = true;
      // this.faturaFormGroup.patchValue({kdv_haric: (yeniFatura.kdv_dahil * 100) / (100 + (yeniFatura.kdv_yuzde || 0))});
      this.faturaFormGroup.get('kdv_haric').setValue((yeniFatura.kdv_dahil * 100) / (100 + (yeniFatura.kdv_yuzde || 0)));
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
