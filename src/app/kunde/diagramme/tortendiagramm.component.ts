import { Component, type OnInit } from '@angular/core';
import { type DataItem, NgxChartsModule } from '@swimlane/ngx-charts';
import { first, map } from 'rxjs/operators';
import { FindError } from '../shared/errors';
import { KeineKundenError } from './errors';
import { KundeReadService } from '../shared/kundeRead.service'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import log from 'loglevel';

/**
 * Komponente mit dem CSS-Selektor &lt;hs-tortendiagramm&gt; zur Visualisierung
 * von Bewertungen durch ein Tortendiagramm.
 */
@Component({
    selector: 'hs-tortendiagramm',
    templateUrl: './tortendiagramm.html',
    imports: [NgxChartsModule],
    standalone: true,
})
export class TortendiagrammComponent implements OnInit {
    protected dataItems!: DataItem[];

    constructor(private readonly service: KundeReadService) {
        log.debug('TortendiagrammComponent.constructor()');
    }

    /**
     * Daten fuer das Tortendiagramm bereitstellen.
     */
    ngOnInit() {
        log.debug('TortendiagrammComponent.ngOnInit()');
        this.#setDataItems();
    }

    #setDataItems() {
        this.service
            .find()
            .pipe(
                first(),
                map(result => {
                    if (result instanceof FindError) {
                        throw new KeineKundenError();
                    }

                    return result;
                }),
            )
            .subscribe();
    }
}
