import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LaravelFormComponent} from './laravel-form/laravel-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ErrorDirective} from './error.directive';
import {NgModule} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { LaravelSubmitDirective } from './laravel-submit.directive';

@NgModule({
    declarations: [
        AppComponent,
        LaravelFormComponent,
        ErrorDirective,
        LaravelSubmitDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
