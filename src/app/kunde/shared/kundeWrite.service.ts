// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
    HttpClient,
    type HttpErrorResponse,
    HttpHeaders,
    HttpResponse,
} from '@angular/common/http';
import { type Observable, of } from 'rxjs';
import { RemoveError, SaveError, UpdateError } from './errors';
import { catchError, first, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import { type Kunde } from './kunde';
// eslint-disable-next-line sort-imports
import { Injectable } from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import log from 'loglevel';
import { paths } from '../../shared/paths';
import { toKundeServer } from './kundeServer';

// Methoden der Klasse HttpClient
//  * get(url, options) – HTTP GET request
//  * post(url, body, options) – HTTP POST request
//  * put(url, body, options) – HTTP PUT request
//  * patch(url, body, options) – HTTP PATCH request
//  * delete(url, options) – HTTP DELETE request

/**
 * Die Service-Klasse zu B&uuml;cher wird zum "Root Application Injector"
 * hinzugefuegt und ist in allen Klassen der Webanwendung verfuegbar.
 */
@Injectable({ providedIn: 'root' })
export class KundeWriteService {
    readonly #baseUrl = paths.base;

    /**
     * @param httpClient injizierter Service HttpClient (von Angular)
     * @return void
     */
    constructor(
        private readonly httpClient: HttpClient,
        private readonly authService: AuthService,
    ) {
        log.debug('KundeWriteService.constructor: baseUrl=', this.#baseUrl);
    }

    /**
     * Einen neuen Kunden anlegen
     * @param neuerKunde Das JSON-Objekt mit dem neuen Kunden
     */
    save(kunde: Kunde): Observable<SaveError | string> {
        log.debug('KundeWriteService.save: kunde=', kunde);
        kunde.geburtsdatum = Temporal.Now.plainDateISO();
        log.debug('KundeWriteService.save: kunde=', kunde);

        const authorizationStr = `${this.authService.authorization}`;
        log.debug(
            'KundeWriteService.save: authorizationStr=',
            authorizationStr,
        );

        // eslint-disable-next-line eslint-comments/disable-enable-pair
        /* eslint-disable @typescript-eslint/naming-convention */
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: authorizationStr,
            Accept: 'text/plain',
        });

        return this.httpClient
            .post(this.#baseUrl, toKundeServer(kunde), {
                headers,
                observe: 'response',
                responseType: 'text',
            })
            .pipe(
                first(),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                catchError((err: unknown, _$) => {
                    const errResponse = err as HttpErrorResponse;
                    return of(new SaveError(errResponse.status, errResponse));
                }),

                // entweder Observable<HttpResponse<string>> oder Observable<SaveError>
                map(result => this.#mapSaveResultToId(result)),
            );
    }

    #mapSaveResultToId(
        result: HttpResponse<string> | SaveError,
    ): SaveError | string {
        if (!(result instanceof HttpResponse)) {
            return result;
        }

        const response = result;
        log.debug(
            'KundeWriteService.#mapSaveResultToId: map: response',
            response,
        );

        // id aus Header "Locaction" extrahieren
        const location = response.headers.get('Location');
        const id = location?.slice(location.lastIndexOf('/') + 1);

        if (id === undefined) {
            return new SaveError(-1, 'Keine Id');
        }

        return id;
    }

    /**
     * Einen vorhandenen Kunde aktualisieren
     * @param kunde Das JSON-Objekt mit den aktualisierten Kundendaten
     */
    update(kunde: Kunde): Observable<Kunde | UpdateError> {
        log.debug('KundeWriteService.update: kunde=', kunde);

        const { id, version, ...kundeDTO } = kunde;
        if (version === undefined) {
            const msg = `Keine Versionsnummer fuer den Kunden ${id}`;
            log.debug(msg);
            return of(new UpdateError(-1, msg));
        }

        const url = `${this.#baseUrl}/${id}`;

        const authorizationStr = `${this.authService.authorization}`;
        log.debug(
            'KundeWriteService.update: authorizationStr=',
            authorizationStr,
        );

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'If-Match': `"${version}"`,
            Authorization: authorizationStr,
            Accept: 'text/plain',
        });

        log.debug('KundeWriteService.update: headers=', headers);

        log.debug('KundeWriteService.update: kundeDTO=', kundeDTO);
        return this.httpClient
            .put(url, kundeDTO, { headers, observe: 'response' })
            .pipe(
                first(),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                catchError((err: unknown, _$) => {
                    const errResponse = err as HttpErrorResponse;
                    log.debug('KundeWriteService.update: err=', err);
                    return of(new UpdateError(errResponse.status, errResponse));
                }),

                map(result => this.#mapUpdateResultToVersion(result)),

                map(versionOderError => {
                    if (versionOderError instanceof UpdateError) {
                        return versionOderError;
                    }
                    kunde.version = versionOderError;
                    return kunde;
                }),
            );
    }

    #mapUpdateResultToVersion(
        result: HttpResponse<unknown> | UpdateError,
    ): UpdateError | number {
        if (result instanceof UpdateError) {
            return result;
        }

        const response = result;
        log.debug(
            'KundeWriteService.#mapUpdateResultToVersion: response',
            response,
        );
        const etag = response.headers.get('ETag');
        log.debug('KundeWriteService.#mapUpdateResultToVersion: etag=', etag);

        const ende = etag?.lastIndexOf('"');
        const versionStr = etag?.slice(1, ende) ?? '1';
        return Number.parseInt(versionStr, 10);
    }

    /**
     * Ein Kunde l&ouml;schen
     * @param kunde Das JSON-Objekt mit dem zu loeschenden Kunde
     */
    remove(kunde: Kunde): Observable<Record<string, unknown> | RemoveError> {
        log.debug('KundeWriteService.remove: kunde=', kunde);
        const url = `${this.#baseUrl}/${kunde.id}`;

        const authorizationStr = `${this.authService.authorization}`;
        log.debug(
            'KundeWriteService.remove: authorizationStr=',
            authorizationStr,
        );

        const headers = new HttpHeaders({
            Authorization: authorizationStr,
            Accept: 'text/plain',
        });

        return this.httpClient.delete(url, { headers }).pipe(
            first(),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catchError((err: unknown, _$) => {
                const errResponse = err as HttpErrorResponse;
                return of(new RemoveError(errResponse.status));
            }),

            map(result => {
                if (result instanceof RemoveError) {
                    return result;
                }
                return {};
            }),
        );
    }
}
