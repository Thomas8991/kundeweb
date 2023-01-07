import { type Temporal } from '@js-temporal/polyfill';
import { type Umsatz } from './umsatz';
// eslint-disable-next-line sort-imports
import { type Adresse } from './adresse';

export type FamilienstandType = 'G' | 'L' | 'VH' | 'VW';

export type InteresseType = 'L' | 'R' | 'S';

export type GeschlechtType = 'D' | 'M' | 'W';

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export interface Kunde {
    id: string | undefined;
    version: number | undefined;
    nachname: string;
    email: string;
    kategorie: number;
    newsletter: boolean;
    geburtsdatum: Temporal.PlainDate | undefined;
    homepage: string;
    geschlecht: GeschlechtType;
    familienstand: FamilienstandType;
    interessen: InteresseType[];
    umsatz: Umsatz;
    adresse: Adresse;
}

/**
 * Gemeinsame Datenfelder unabh&auml;ngig, ob die Buchdaten von einem Server
 * (z.B. RESTful Web Service) oder von einem Formular kommen.
 * Verwendung in den Interfaces:
 * - BuchServer für BuchReadService
 * - BuchForm für CreateBuchComponent
 */
export interface KundeShared {
    nachname: string;
    email: string;
    kategorie: number;
    newsletter: boolean;
    homepage: string;
    geschlecht: GeschlechtType;
    familienstand: FamilienstandType;
    interessen: InteresseType[];
    umsatz: Umsatz;
    adresse: Adresse;
}

/**
 * common data fields for writing
 */
export interface KundeSharedWrite {
    nachname: string;
    email: string;
    newsletter: boolean;
    homepage: string;
    geschlecht: GeschlechtType;
    familienstand: FamilienstandType;
    interessen: InteresseType[];
    waehrung: string;
    betrag: number;
    plz: string;
    ort: string;
}
