import { Component, Input, type OnInit } from '@angular/core';
import log from 'loglevel';

/**
 * Komponente f&uuml;r das Tag <code>hs-details-Email</code>
 */
@Component({
    selector: 'hs-details-email',
    templateUrl: './details-email.component.html',
    standalone: true,
})
export class DetailsEmailComponent implements OnInit {
    @Input()
    email!: string;

    ngOnInit() {
        log.debug('DetailsEmailComponent.email=', this.email);
    }
}
