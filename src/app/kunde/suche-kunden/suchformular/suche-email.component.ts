import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import log from 'loglevel';

/**
 * Komponente f&uuml;r den CSS-Selektor <code>hs-suche-verlag</code>
 */
@Component({
    selector: 'hs-suche-email',
    templateUrl: './suche-email.component.html',
    imports: [FormsModule],
    standalone: true,
})
export class SucheEmailComponent {
    protected email = '';

    @Output()
    protected readonly email$ = new Subject<string>();

    constructor() {
        log.debug('SucheEmailComponent.constructor()');
    }

    onBlur() {
        log.debug(`SucheEmailComponent.onBlur: nachname=${this.email}`);
        this.email$.next(this.email);
    }
}
