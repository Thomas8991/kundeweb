import { Component, Input, type OnInit } from '@angular/core';
import { DetailsAdresseComponent } from './details-adresse.component';
import { DetailsEmailComponent } from './details-email.component';
import { DetailsGeburtsdatumComponent } from './details-geburtsdatum.component';
import { DetailsGeschlechtComponent } from './details-geschlecht.component';
import { DetailsHomepageComponent } from './details-homepage.component';
import { DetailsNachnameComponent } from './details-nachname.component';
import { DetailsNewsletterComponent } from './details-newsletter.component';
import { DetailsUmsatzComponent } from './details-umsatz.component';
import { type Kunde } from '../../shared';
import { NgIf } from '@angular/common';
import log from 'loglevel';

/**
 * Komponente f&uuml;r das Tag <code>hs-stammdaten</code>
 */
@Component({
    selector: 'hs-details-stammdaten',
    templateUrl: './details-stammdaten.component.html',
    imports: [
        DetailsAdresseComponent,
        DetailsEmailComponent,
        DetailsGeburtsdatumComponent,
        DetailsGeschlechtComponent,
        DetailsHomepageComponent,
        DetailsNachnameComponent,
        DetailsNewsletterComponent,
        DetailsUmsatzComponent,
        NgIf,
    ],
    standalone: true,
})
export class DetailsStammdatenComponent implements OnInit {
    // Property Binding: <hs-details-stammdaten [kunde]="...">
    // Decorator fuer ein Attribut. Siehe InputMetadata
    @Input()
    kunde!: Kunde;

    ngOnInit() {
        log.debug('DetailsKundeComponent.kunde=', this.kunde);
    }
}
