import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-laravel-form',
    templateUrl: './laravel-form.component.html',
    styleUrls: ['./laravel-form.component.scss']
})
export class LaravelFormComponent implements OnInit {
    @Input() formGroup: FormGroup;

    @Input() set value(value) {
        if (this.formGroup) {
            this.formGroup.patchValue(value);
        }
    }

    @Input() action: any;
    @Input() method: 'POST' | 'PUT' | 'insert' | 'update';
    @Output() actionSuccess = new EventEmitter();
    @Output() actionFail = new EventEmitter();
    @Output() submit = new EventEmitter();

    progress$ = new BehaviorSubject<boolean>(false);

    get progress() {
        return this.progress$.getValue();
    }

    status$ = new BehaviorSubject<boolean>(false);

    get status() {
        return this.status$.getValue();
    }

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        if (this.formGroup.status === 'VALID') {
            this.status$.next(true);
        } else {
            this.status$.next(false);
        }
        this.formGroup.statusChanges.subscribe(status => {
            if (status === 'VALID') {
                this.status$.next(true);
            } else {
                this.status$.next(false);
            }
        });
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.submit.emit(this.formGroup.value);
            if (this.action) {
                this.runAction();
            }
        }
    }

    runAction() {
        this.progress$.next(true);
        const newAction = 'https://demo.abs.akdeniz.edu.tr/api/v1' + this.action;
        let req: Observable<any>;
        if (this.method === 'POST' || this.method === 'insert') {
            req = this.http.post(newAction, this.formGroup.value);
        } else if (this.method === 'PUT' || this.method === 'update') {
            req = this.http.put(newAction, this.formGroup.value);
        } else {
            throw new Error('Invalid laravel form method');
        }

        req.pipe(tap(() => this.progress$.next(false), () => this.progress$.next(false)))
            .subscribe(resp => {
                    this.actionSuccess.emit(resp);
                }, (err: HttpErrorResponse) => {
                    this.actionFail.emit(err);
                    if (err.error) {
                        const response = err.error;
                        console.log(response);
                        if (err.status === 422 && response.errors) {
                            for (const controlName of Object.keys(response.errors)) {
                                const laravelErrors = {};
                                response.errors[controlName].forEach((error, index) => {
                                    laravelErrors['laravel' + index] = error;
                                });
                                console.log(controlName, laravelErrors);
                                this.formGroup.get(controlName).setErrors(laravelErrors);
                            }
                        } else {
                            console.warn('Request non-validation error', err);
                        }
                    } else {
                        console.warn('Weird request error - no response', err);
                    }
                }
            );
        // this.mockApi(this.formGroup.value)
        //     .pipe(tap(() => this.progress$.next(false)))
        //     .subscribe(resp => {
        //         if (resp.errors) {
        //             for (const controlName of Object.keys(resp.errors)) {
        //                 const laravelErrors = {};
        //                 resp.errors[controlName].forEach((error, index) => {
        //                     laravelErrors['laravel' + index] = error;
        //                 });
        //                 this.formGroup.get(controlName).setErrors(laravelErrors);
        //             }
        //         }
        //     });
    }

    // mockApi(asd) {
    //     return of({
    //         message: 'asda',
    //         errors: {
    //             tc: ['hata1'],
    //             email: ['hata2', 'hata3'],
    //         }
    //     });
    // }

    getErrors() {
        const result = {};
        for (const [key, value] of Object.entries(this.formGroup.controls)) {
            result[key] = value.errors;
        }
        return result;
    }
}
