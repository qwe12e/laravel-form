import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'input[type=file][base64File]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: Base64FileDirective,
        multi: true
    }]
})
export class Base64FileDirective implements ControlValueAccessor {
    onChange: (any) => void = (k: any) => {
    };

    @HostListener('change', ['$event.target']) handleInput(event) {
        console.log(event);
        const reader = new FileReader();
        reader.readAsDataURL(event.files[0]);
        reader.onload = () => {
            console.log(reader.result);
            this.onChange(reader.result);
        };
        reader.onerror = (err) => {
            this.onChange(null);
            console.error(err);
        };
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
        const normalizedValue = obj == null ? '' : obj;
        this.renderer.setProperty(this.el.nativeElement, 'value', normalizedValue);
    }

}
