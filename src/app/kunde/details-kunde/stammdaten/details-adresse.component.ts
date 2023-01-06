import { Component, Input, type OnInit } from '@angular/core';
import type { Adresse } from '../../shared/adresse';
import log from 'loglevel';

/**
 * Komponente f&uuml;r das Tag <code>hs-details-verlag</code>
 */
@Component({
    selector: 'hs-details-adresse',
    templateUrl: './details-adresse.component.html',
    standalone: true,
})
export class DetailsAdresseComponent implements OnInit {
    @Input()
    adresse: Adresse | '' | undefined;

    ngOnInit() {
        log.debug('DetailsAdresseComponent.adresse=', this.adresse);
    }
}
