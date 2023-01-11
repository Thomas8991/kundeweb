import { ActivatedRoute, Router } from '@angular/router'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import { Component, type OnInit } from '@angular/core';
import { FindError, UpdateError } from '../shared/errors';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { type GeschlechtType, type Kunde } from '../shared/kunde';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { first, tap } from 'rxjs/operators';
import { ErrorMessageComponent } from '../../shared/error-message.component';
import { KundeReadService } from '../shared/kundeRead.service'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import { KundeWriteService } from '../shared/kundeWrite.service'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import { NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import { UpdateAdresseComponent } from './update-adresse.component';
import { UpdateEmailComponent } from './update-email.component';
import { UpdateGeschlechtComponent } from './update-geschlecht.component';
import { UpdateKategorieComponent } from './update-kategorie.component';
import { UpdateNachnameComponent } from './update-nachname.component';
import log from 'loglevel';

/**
 * Komponente f&uuml;r den CSS-Selektor <code>hs-update-buch</code>
 */
@Component({
    selector: 'hs-update-kunde',
    templateUrl: './update-kunde.component.html',
    imports: [
        ErrorMessageComponent,
        NgIf,
        ReactiveFormsModule,
        UpdateAdresseComponent,
        UpdateGeschlechtComponent,
        UpdateEmailComponent,
        UpdateKategorieComponent,
        UpdateNachnameComponent,
    ],
    standalone: true,
})
export class UpdateKundeComponent implements OnInit {
    kunde: Kunde | undefined;

    readonly form = new FormGroup({});

    errorMsg: string | undefined;

    // eslint-disable-next-line max-params
    constructor(
        private readonly service: KundeWriteService,
        private readonly readService: KundeReadService,
        private readonly titleService: Title,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {
        log.debug('UpdateKundeComponent.constructor()');
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id') ?? undefined;

        this.readService
            .findById(id)
            .pipe(
                first(),
                tap(result => {
                    this.#setProps(result);
                    log.debug(
                        'UpdateKundeComponent.ngOnInit: kunde=',
                        this.kunde,
                    );
                }),
            )
            .subscribe();
    }

    onSubmit() {
        if (this.form.pristine || this.kunde === undefined) {
            log.debug('UpdateKundeComponent.onSubmit: keine Aenderungen');
            return;
        }

        const { nachname } = this.form.value as { nachname: string };
        const { geschlecht } = this.form.value as {
            geschlecht: GeschlechtType;
        };
        const { kategorie } = this.form.value as { kategorie: number };
        const { email } = this.form.value as { email: string };

        const { kunde, service } = this;

        kunde.nachname = nachname;
        kunde.geschlecht = geschlecht;
        kunde.kategorie = kategorie;
        kunde.email = email;
        log.debug('UpdateKundeComponent.onSubmit: kunde=', kunde);

        service
            .update(kunde)
            .pipe(
                first(),
                tap(result => this.#handleUpdateResult(result)),
            )
            .subscribe({ next: () => this.#navigateHome() });

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false;
    }

    #setProps(result: FindError | Kunde) {
        if (result instanceof FindError) {
            this.#handleFindError(result);
            return;
        }

        this.kunde = result;
        this.errorMsg = undefined;

        const title = `Aktualisieren ${this.kunde.id}`;
        this.titleService.setTitle(title);
    }

    #handleFindError(err: FindError) {
        const { statuscode } = err;
        log.debug('UpdateKundeComponent.#handleError: statuscode=', statuscode);

        this.kunde = undefined;

        switch (statuscode) {
            case HttpStatusCode.NotFound: {
                this.errorMsg = 'Kein Kunde gefunden.';
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

    #handleUpdateResult(result: Kunde | UpdateError) {
        if (!(result instanceof UpdateError)) {
            return;
        }

        const { statuscode } = result;
        log.debug(
            'UpdateStammdatenComponent.#handleError: statuscode=',
            statuscode,
        );

        switch (statuscode) {
            case HttpStatusCode.UnprocessableEntity: {
                const { cause } = result;
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

        log.debug(
            'UpdateStammdatenComponent.#handleError: errorMsg=',
            this.errorMsg,
        );
    }

    async #navigateHome() {
        await this.router.navigate(['/']);
    }
}
