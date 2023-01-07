import { Component, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { SucheNachnameComponent } from './suche-nachname.component';
// eslint-disable-next-line sort-imports
import { SucheEmailComponent } from './suche-email.component';
import { type Suchkriterien } from '../../shared/kundeRead.service';
import { fadeIn } from '../../../shared/animations';
import log from 'loglevel';

/**
 * Komponente f&uuml;r den CSS-Selektor <code>hs-suchformular</code>
 */
@Component({
    selector: 'hs-suchformular',
    templateUrl: './suchformular.component.html',
    animations: [fadeIn],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SucheNachnameComponent,
        SucheEmailComponent,
    ],
    standalone: true,
})
export class SuchformularComponent {
    // Event Binding: <hs-suchformular (suchkriterien$)="...">
    // in RxJS: Observables = Event-Streaming mit Promises
    // Subject fuer @Output: abgeleitet von Observable mit zusaetzl. Funktion next()
    // Ein Subject kann MEHRERE Observer benachrichtigen ("Multicast")
    // https://angular.io/guide/component-interaction#parent-listens-for-child-event
    // Suffix "$" wird als "Finnish Notation" bezeichnet https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b
    @Output()
    protected readonly suchkriterien$ = new Subject<Suchkriterien>();

    #nachname = '';

    #email = '';

    // DI: Constructor Injection (React hat uebrigens keine DI)
    // Empfehlung: Konstruktor nur fuer DI
    constructor() {
        log.debug('SuchformularComponent.constructor()');
    }

    setNachname(nachname: string) {
        log.debug('SuchformularComponent.setNachname', nachname);
        this.#nachname = nachname;
    }

    setEmail(email: string) {
        log.debug('SuchformularComponent.setEmail', email);
        this.#email = email;
    }

    /**
     * Suche nach B&uuml;chern, die den spezfizierten Suchkriterien entsprechen
     */
    onSubmit() {
        log.debug(
            'SuchformularComponent.onSubmit: nachname / email',
            this.#nachname,
            this.#email,
        );

        this.suchkriterien$.next({
            nachname: this.#nachname,
            email: this.#email,
        });
    }
}
