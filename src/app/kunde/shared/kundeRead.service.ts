// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
    HttpClient,
    type HttpErrorResponse,
    HttpParams,
    type HttpResponse,
} from '@angular/common/http';
import { type Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { FindError } from './errors';
import { Injectable } from '@angular/core';
import log from 'loglevel';
import { paths } from '../../shared/paths';
// eslint-disable-next-line sort-imports
import { type KundeServer, toKunde } from './kundeServer';
import { type Kunde } from './kunde';

export interface Suchkriterien {
    nachname: string;
    email: string;
}

export interface KundenServer {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _embedded: {
        kunden: KundeServer[];
    };
}

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
export class KundeReadService {
    readonly #baseUrl = paths.base;

    /**
     * @param httpClient injizierter Service HttpClient (von Angular)
     * @return void
     */
    constructor(private readonly httpClient: HttpClient) {
        log.debug('KundeReadService.constructor: baseUrl=', this.#baseUrl);
    }

    /**
     * Kunden anhand von Suchkriterien suchen
     * @param suchkriterien Die Suchkriterien
     * @returns Gefundene Kunden oder Statuscode des fehlerhaften GET-Requests
     */
    find(
        suchkriterien: Suchkriterien | undefined = undefined, // eslint-disable-line unicorn/no-useless-undefined
    ): Observable<FindError | Kunde[]> {
        log.debug('KundeReadService.find: suchkriterien=', suchkriterien);
        log.debug('KundeReadService.find: url=', this.#baseUrl);

        const params = this.#suchkriterienToHttpParams(suchkriterien);

        return (
            this.httpClient
                .get<KundenServer>(this.#baseUrl, { params })

                // pipe ist eine "pure" Funktion, die ein Observable in ein NEUES Observable transformiert
                .pipe(
                    // 1 Datensatz empfangen und danach implizites "unsubscribe"
                    // entspricht take(1)
                    first(),

                    catchError(
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        (err: unknown, _$) =>
                            of(this.#buildFindError(err as HttpErrorResponse)),
                    ),

                    map(restResult => this.#toKundeArrayOrError(restResult)),
                )
        );
    }

    #toKundeArrayOrError(
        restResult: FindError | KundenServer,
    ): FindError | Kunde[] {
        log.debug(
            'KundeReadService.#toKundeArrayOrError: restResult=',
            restResult,
        );
        if (restResult instanceof FindError) {
            return restResult;
        }

        // eslint-disable-next-line no-underscore-dangle
        const kunden = restResult._embedded.kunden.map(kundeServer =>
            toKunde(kundeServer),
        );
        log.debug('KundeReadService.#toKundeArrayOrError: kunden=', kunden);
        return kunden;
    }

    /**
     * Einen Kunden anhand der ID suchen
     * @param id Die ID des gesuchten Kunde
     */
    findById(id: string | undefined): Observable<FindError | Kunde> {
        log.debug('KundeReadService.findById: id=', id);

        if (id === undefined) {
            log.debug('KundeReadService.findById: Keine Id');
            return of(this.#buildFindError());
        }

        // wegen fehlender Versionsnummer (im ETag) nachladen
        const url = `${this.#baseUrl}/${id}`;
        log.debug('KundeReadService.findById: url=', url);

        return (
            this.httpClient
                /* eslint-disable object-curly-newline */
                .get<KundeServer>(url, {
                    observe: 'response',
                })
                /* eslint-enable object-curly-newline */

                .pipe(
                    // 1 Datensatz empfangen und danach implizites "unsubscribe"
                    first(),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    catchError((err: unknown, _$) => {
                        const errResponse = err as HttpErrorResponse;
                        return of(this.#buildFindError(errResponse));
                    }),

                    // entweder Observable<HttpResponse<KundeServer>> oder Observable<FindError>
                    map(restResult => this.#toKundeOrError(restResult)),
                )
        );
    }

    #toKundeOrError(
        restResult: FindError | HttpResponse<KundeServer>,
    ): FindError | Kunde {
        if (restResult instanceof FindError) {
            return restResult;
        }

        const { body, headers } = restResult;
        if (body === null) {
            return this.#buildFindError();
        }

        const etag = headers.get('ETag') ?? undefined;
        log.debug('KundeReadService.#toKundeOrError: etag=', etag);

        return toKunde(body, etag);
    }

    /**
     * Suchkriterien in Request-Parameter konvertieren.
     * @param suchkriterien Suchkriterien fuer den GET-Request.
     * @return Parameter fuer den GET-Request
     */
    #suchkriterienToHttpParams(
        suchkriterien: Suchkriterien | undefined,
    ): HttpParams {
        log.debug(
            'KundeReadService.#suchkriterienToHttpParams: suchkriterien=',
            suchkriterien,
        );
        let httpParams = new HttpParams();

        if (suchkriterien === undefined) {
            return httpParams;
        }

        const { nachname, email } = suchkriterien;

        if (nachname !== '') {
            httpParams = httpParams.set('nachname', nachname);
        }
        if (email !== '') {
            httpParams = httpParams.set('email', email);
        }

        return httpParams;
    }

    #buildFindError(err?: HttpErrorResponse) {
        if (err === undefined) {
            return new FindError(-1);
        }

        if (err.error instanceof ProgressEvent) {
            const msg = 'Client-seitiger oder Netzwerkfehler';
            log.error(msg, err.error);
            return new FindError(-1, err);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { status, error } = err;
        log.debug(
            'KundeReadService.#buildFindError: status / Response-Body=',
            status,
            error,
        );
        return new FindError(status, err);
    }
}
