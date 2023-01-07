import { Component, type OnInit } from '@angular/core';
import {
    type DataItem,
    type MultiSeries,
    NgxChartsModule,
} from '@swimlane/ngx-charts';
import { first, map, tap } from 'rxjs/operators';
import { FindError } from '../shared/errors';
import { KeineKundenError } from './errors';
import { type Kunde } from '../shared/kunde';
import { KundeReadService } from '../shared/kundeRead.service'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import log from 'loglevel';

@Component({
    selector: 'hs-liniendiagramm',
    templateUrl: './liniendiagramm.html',
    imports: [NgxChartsModule],
    standalone: true,
})
export class LiniendiagrammComponent implements OnInit {
    protected series!: MultiSeries;

    constructor(private readonly service: KundeReadService) {
        log.debug('LiniendiagrammComponent.constructor()');
    }

    /**
     * Daten fuer das Liniendiagramm bereitstellen.
     */
    ngOnInit() {
        log.debug('LiniendiagrammComponent.ngOnInit()');
        this.#setSeries();
    }

    #setSeries() {
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
                tap(kundeItems => {
                    const kategorieItems = this.#getKategorieItems(kundeItems);
                    this.#initSeries(kategorieItems);
                }),
            )
            .subscribe();
    }

    #getKategorieItems(kunden: Kunde[]): DataItem[] {
        // eslint-disable-next-line arrow-body-style
        return kunden.map(kunde => {
            return {
                name: kunde.id!, // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
                value: kunde.kategorie,
            };
        });
    }

    #initSeries(kategorieItems: DataItem[]) {
        const series: MultiSeries = [
            {
                name: 'Kategorie',
                series: kategorieItems,
            },
        ];

        this.series = series;
    }
}
