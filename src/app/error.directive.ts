import {Directive, ElementRef, Host, OnInit, Optional, Renderer2} from '@angular/core';
import {MatFormField} from '@angular/material';
import {FormControl, NgControl} from '@angular/forms';
import {printErrors} from './laravel-form/laravel-form.helpers';

@Directive({
    selector: '[appError]'
})
export class ErrorDirective implements OnInit {

    formControl: NgControl;

    constructor(@Optional() @Host() private parent: MatFormField, private elementRef: ElementRef, private renderer: Renderer2) {

    }

    ngOnInit(): void {
        if (this.parent) {
            if (this.parent._control && this.parent._control.ngControl && this.parent._control.ngControl.errors) {
                this.formControl = this.parent._control.ngControl;
                this.writeErrors();
                this.formControl.statusChanges.subscribe(status => {
                    this.writeErrors();
                });
            }
        }
    }

    writeErrors() {
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', this.printErrors());
    }

    printErrors(): string {
        const errors = this.formControl.errors;
        if (!errors) {
            return '';
        }
        return printErrors(errors);
    }

}
