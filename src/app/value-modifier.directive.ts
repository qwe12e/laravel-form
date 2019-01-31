import {Directive, ElementRef, Input} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[valueModifier]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {'(keyup)': 'onKeyUp($event)'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: ValueModifierDirective,
        multi: true,
    }]
})
export class ValueModifierDirective implements ControlValueAccessor {

    @Input() valueModifier: [Function, Function];
    @Input() formControl: FormControl;
    onChange: (any) => void = (k: any): void => {
    };

    constructor(private el: ElementRef) {
    }

    onKeyUp(e: { target: HTMLInputElement }) {
        console.log('modifieeer contrlü = ', this.formControl);
        const newValue = this.valueModifier[0](e.target.value, this.formControl);
        this.onChange(newValue);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
        const newValue = this.valueModifier[1](obj, this.formControl);
        this.el.nativeElement.value = newValue;
    }
}
