import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'app-laravel-form',
    templateUrl: './laravel-form.component.html',
    styleUrls: ['./laravel-form.component.scss']
})
export class LaravelFormComponent implements OnInit {
    @Input() formGroup: FormGroup;

    progress$ = new BehaviorSubject<boolean>(false);

    get progress() {
        return this.progress$.getValue();
    }

    status$ = new BehaviorSubject<boolean>(false);

    get status() {
        return this.status$.getValue();
    }

    constructor() {
    }

    ngOnInit() {
        this.formGroup.statusChanges.subscribe(status => {
            if (status === 'VALID') {
                this.status$.next(true);
            } else {
                this.status$.next(false);
            }
        });
    }

    onSubmit() {
        this.progress$.next(true);
        this.mockApi(this.formGroup.value)
            .pipe(tap(() => this.progress$.next(false)))
            .subscribe(resp => {
                if (resp.errors) {
                    for (const controlName of Object.keys(resp.errors)) {
                        const laravelErrors = {};
                        resp.errors[controlName].forEach((error, index) => {
                            console.log(error);
                            laravelErrors['laravel' + index] = error;
                        });
                        console.log(controlName);
                        this.formGroup.get(controlName).setErrors(laravelErrors);
                    }
                }
            });
        console.log(this.formGroup);
    }

    mockApi(asd) {
        return of({
            message: 'asda',
            errors: {
                ad: ['hata1'],
                email: ['hata2', 'hata3'],
            }
        });
    }

    getErrors() {
        const result = {};
        for (const [key, value] of Object.entries(this.formGroup.controls)) {
            result[key] = value.errors;
        }
        return result;
    }
}
