import { Component, Input, type OnInit } from '@angular/core';
import type { GeschlechtType } from '../../shared/kunde';
// eslint-disable-next-line sort-imports
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import log from 'loglevel';

/**
 * Komponente f&uuml;r das Tag <code>hs-details-geschlecht</code>
 */
@Component({
    selector: 'hs-details-geschlecht',
    templateUrl: './details-geschlecht.component.html',
    imports: [NgSwitch, NgSwitchCase, NgSwitchDefault],
    standalone: true,
})
export class DetailsGeschlechtComponent implements OnInit {
    @Input()
    geschlecht!: GeschlechtType;

    ngOnInit() {
        log.debug('DetailsGeschlechtComponent.geschlecht=', this.geschlecht);
    }
}
