import { Component, Input, type OnInit } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import log from 'loglevel';

/**
 * Komponente f&uuml;r das Tag <code>hs-details-preis</code>
 */
@Component({
    selector: 'hs-details-umsatz',
    templateUrl: './details-umsatz.component.html',
    imports: [CurrencyPipe, DecimalPipe],
    standalone: true,
})
export class DetailsUmsatzComponent implements OnInit {
    @Input()
    umsatz!: number | '';

    ngOnInit() {
        log.debug('DetailsUmsatzComponent.umsatz=', this.umsatz);
    }
}
