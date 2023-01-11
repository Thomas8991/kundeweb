import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import log from 'loglevel';

/**
 * Komponente f&uuml;r den CSS-Selektor <code>hs-suche-nachname</code>
 */
@Component({
    selector: 'hs-suche-nachname',
    templateUrl: './suche-nachname.component.html',
    imports: [FormsModule],
    standalone: true,
})
export class SucheNachnameComponent {
    protected nachname = '';

    @Output()
    protected readonly nachname$ = new Subject<string>();

    constructor() {
        log.debug('SucheNachnameComponent.constructor()');
    }

    onBlur() {
        log.debug(`SucheNachnameComponent.onBlur: nachname=${this.nachname}`);
        this.nachname$.next(this.nachname);
    }
}
