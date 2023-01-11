import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { type KundeForm, toKunde } from './kundeForm';
import { first, tap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { CreateAdresseComponent } from './create-adresse.component';
import { CreateEmailComponent } from './create-email.component';
import { CreateFamilienstandComponent } from './create-familienstand.component';
import { CreateGeburtsdatumModule } from './create-geburtsdatum.module';
import { CreateGeschlechtComponent } from './create-geschlecht.component';
import { CreateHomepageComponent } from './create-homepage.component';
import { CreateInteressenComponent } from './create-interessen.component';
import { CreateKategorieComponent } from './create-kategorie.component';
import { CreateNachnameComponent } from './create-nachname.component';
import { CreateNewsletterComponent } from './create-newsletter.component';
import { CreateUmsatzComponent } from './create-umsatz.component';
import { ErrorMessageComponent } from '../../shared/error-message.component';
import { KundeWriteService } from '../shared/kundeWrite.service'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import { NgIf } from '@angular/common';
import { Router } from '@angular/router'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import { SaveError } from '../shared/errors';
import log from 'loglevel';

/**
 * Komponente mit dem Tag &lt;create-kunde&gt;, um das Erfassungsformular
 * f&uuml;r einen neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-kunde',
    templateUrl: './create-kunde.component.html',
    imports: [
        CreateAdresseComponent,
        CreateEmailComponent,
        CreateFamilienstandComponent,
        CreateGeburtsdatumModule,
        CreateGeschlechtComponent,
        CreateHomepageComponent,
        CreateInteressenComponent,
        CreateKategorieComponent,
        CreateNachnameComponent,
        CreateNewsletterComponent,
        CreateUmsatzComponent,
        ErrorMessageComponent,
        NgIf,
        ReactiveFormsModule,
    ],
    standalone: true,
})
export class CreateKundeComponent {
    readonly createForm = new FormGroup({});

    showWarning = false;

    fertig = false;

    protected errorMsg: string | undefined = undefined;

    constructor(
        private readonly service: KundeWriteService,
        private readonly router: Router,
    ) {
        log.debug(
            'CreateKuneComponent.constructor: Injizierter Router:',
            router,
        );
    }

    /**
     * Die Methode <code>onSubmit</code> realisiert den Event-Handler, wenn das
     * Formular abgeschickt wird, um ein neues Kunde anzulegen.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    onSubmit() {
        if (this.createForm.invalid) {
            log.debug(
                'CreateKundeComponent.onSave: Validierungsfehler',
                this.createForm,
            );
        }

        const kundeForm = this.createForm.value as KundeForm;
        const neuerKunde = toKunde(kundeForm);
        log.debug('CreateKundeComponent.onSave: neuerKunde=', neuerKunde);

        this.service
            .save(neuerKunde)
            .pipe(
                // 1. Datensatz empfangen und danach implizites "unsubscribe"
                first(),
                tap(result => this.#setProps(result)),
            )
            // asynchrone Funktionen nur bei subscribe, nicht bei tap
            .subscribe({ next: () => this.#navigateHome() });
    }

    #setProps(result: SaveError | string) {
        if (result instanceof SaveError) {
            this.#handleError(result);
            return;
        }

        this.fertig = true;
        this.showWarning = false;
        this.errorMsg = undefined;

        const id = result;
        log.debug('CreateKundeComponent.#setProps: id=', id);
    }

    #handleError(err: SaveError) {
        const { statuscode } = err;
        log.debug(
            `CreateKundeComponent.#handleError: statuscode=${statuscode}, err=`,
            err,
        );

        switch (statuscode) {
            case HttpStatusCode.UnprocessableEntity: {
                const { cause } = err;
                // TODO Aufbereitung der Fehlermeldung: u.a. Anfuehrungszeichen
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                this.errorMsg =
                    cause instanceof HttpErrorResponse
                        ? cause.error
                        : JSON.stringify(cause);
                break;
            }

            case HttpStatusCode.TooManyRequests: {
                this.errorMsg =
                    'Zu viele Anfragen. Bitte versuchen Sie es später noch einmal.';
                break;
            }
            case HttpStatusCode.GatewayTimeout: {
                this.errorMsg = 'Ein interner Fehler ist aufgetreten.';
                log.error('Laeuft der Appserver? Port-Forwarding?');
                break;
            }
            default: {
                this.errorMsg = 'Ein unbekannter Fehler ist aufgetreten.';
                break;
            }
        }
    }

    async #navigateHome() {
        if (this.errorMsg === undefined) {
            log.debug('CreateKundeComponent.#navigateHome: Navigation');
            await this.router.navigate(['/']);
        }
    }
}
