import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LaravelFormErrorService} from './laravel-form-error.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder, public laravelError: LaravelFormErrorService) {
        this.formGroup = this.formBuilder.group({
            ad: ['', Validators.required],
            email: ['', Validators.required]
        });
    }
}
