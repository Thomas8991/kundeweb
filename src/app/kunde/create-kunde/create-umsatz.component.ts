import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import log from 'loglevel';

/**
 * Komponente mit dem Tag &lt;hs-create-preis&gt;, um das Erfassungsformular
 * f&uuml;r einen neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-umsatz',
    templateUrl: './create-umsatz.component.html',
    imports: [FormsModule, NgIf, ReactiveFormsModule],
    standalone: true,
})
export class CreateUmsatzComponent implements OnInit {
    @Input()
    createForm!: FormGroup;

    readonly waehrung = new FormControl(undefined);

    readonly betrag = new FormControl(undefined);

    ngOnInit() {
        log.debug('CreateUmsatzComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.createForm.addControl('waehrung', this.waehrung);
        this.createForm.addControl('betrag', this.betrag);
    }
}
