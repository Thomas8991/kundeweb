import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import log from 'loglevel';

/**
 * Komponente mit dem Tag &lt;hs-create-adresse&gt;, um das Erfassungsformular
 * f&uuml;r einen neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-adresse',
    templateUrl: './create-adresse.component.html',
    imports: [FormsModule, NgIf, ReactiveFormsModule],
    standalone: true,
})
export class CreateAdresseComponent implements OnInit {
    @Input()
    createForm!: FormGroup;

    readonly plz = new FormControl(undefined);

    readonly ort = new FormControl(undefined, Validators.required);

    ngOnInit() {
        log.debug('CreateAdresseComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.createForm.addControl('plz', this.plz);
        this.createForm.addControl('ort', this.ort);
    }
}
