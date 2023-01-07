import type { InteresseType } from '../shared/kunde';
import { type KundeSharedWrite } from '../shared/kunde';
import { type Kunde } from '../shared';
import { Temporal } from '@js-temporal/polyfill';
import log from 'loglevel';

/**
 * Daten aus einem Formular:
 * <ul>
 *  <li> je 1 Control fuer jede Checkbox und
 *  <li> au&szlig;erdem Strings f&uuml;r Eingabefelder f&uuml;r Zahlen.
 * </ul>
 */
export interface KundeForm extends KundeSharedWrite {
    kategorie: string;
    geburtsdatum: Date;
    sport: boolean;
    lesen: boolean;
    reiten: boolean;
}

/**
 * Ein Kunde-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
 * @param kunde JSON-Objekt mit Daten vom Formular
 * @return Das initialisierte Kunde-Objekt
 */
// eslint-disable-next-line max-lines-per-function
export const toKunde = (kundeForm: KundeForm) => {
    log.debug('toKunde: kundeForm=', kundeForm);

    const {
        nachname,
        email,
        kategorie,
        newsletter,
        geburtsdatum,
        homepage,
        geschlecht,
        familienstand,
        sport,
        lesen,
        reiten,
        betrag,
        waehrung,
        plz,
        ort,
    } = kundeForm;

    const datumTemporal = new Temporal.PlainDate(
        geburtsdatum.getFullYear(),
        geburtsdatum.getMonth() + 1,
        geburtsdatum.getDate(),
    );
    log.debug('toKunde: datumTemporal=', datumTemporal);

    const interessen: InteresseType[] = [];
    if (sport) {
        interessen.push('S');
    }
    if (lesen) {
        interessen.push('L');
    }
    if (reiten) {
        interessen.push('R');
    }

    const kunde: Kunde = {
        id: undefined,
        nachname,
        email,
        kategorie: Number(kategorie),
        newsletter,
        geburtsdatum: datumTemporal,
        homepage,
        geschlecht,
        familienstand,
        interessen,
        umsatz: {
            betrag,
            waehrung,
        },
        adresse: {
            plz,
            ort,
        },
        version: 0,
    };
    log.debug('toKunde: kunde=', kunde);
    return kunde;
};
