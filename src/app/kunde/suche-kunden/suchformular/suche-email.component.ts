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
    protected email: string | undefined;

    @Output()
    protected readonly email$ = new Subject<string>();

    constructor() {
        log.debug('SucheVerlagComponent.constructor()');
    }

    onChange(event: Event) {
        // https://stackoverflow.com/questions/44321326/property-value-does-not-exist-on-type-eventtarget-in-typescript
        const { value } = event.target as HTMLSelectElement;
        log.debug('SucheEmailComponent.onChange: value=', value);
        this.email$.next(value);
    }
}
