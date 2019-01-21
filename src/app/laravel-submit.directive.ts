import {AfterViewInit, Directive, ElementRef, Host, OnInit, Optional, Renderer2} from '@angular/core';
import {LaravelFormComponent} from './laravel-form/laravel-form.component';

@Directive({
    selector: '[laravelSubmit]'
})
export class LaravelSubmitDirective implements AfterViewInit {
    status = false;
    progress = false;

    constructor(@Optional() @Host() private parent: LaravelFormComponent, private elementRef: ElementRef, private renderer: Renderer2) {
    }

    createProgressBar() {
        const progressBar = document.createElement('mat-progress-bar');
        progressBar.setAttribute('mode', 'indeterminate');
        progressBar.setAttribute('style',
            `position: absolute;
                     bottom: 0px;
                     left: 0;
                     border-bottom-left-radius: 50px;
                     border-bottom-right-radius: 50px;');`);
        this.renderer.appendChild(this.elementRef.nativeElement, progressBar);
    }

    ngAfterViewInit(): void {
        this.setSubmit();
        this.createProgressBar();
        this.parent.progress$.subscribe(progress => {
            this.progress = progress;
            this.setDisabled();
        });
        this.parent.status$.subscribe(status => {
            this.status = status;
            this.setDisabled();
        });
    }

    setSubmit() {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', 'submit');
    }

// `    position: absolute;
//     bottom: 0px;
//     left: 0;
//     border-bottom-left-radius: 50px;
//     border-bottom-right-radius: 50px;
//     /* display: none; */`
    setDisabled() {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', !this.status || this.progress);
    }


}
