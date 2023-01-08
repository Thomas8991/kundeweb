import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import log from 'loglevel';

/**
 * Komponente mit dem Tag &lt;hs-create-geschlecht&gt;, um das Erfassungsformular
 * f&uuml;r ein neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-familienstand',
    templateUrl: './create-familienstand.component.html',
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class CreateFamilienstandComponent implements OnInit {
    @Input()
    createForm!: FormGroup;

    readonly familienstand = new FormControl(undefined, Validators.required);

    ngOnInit() {
        log.debug('CreateFamilienstandComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.createForm.addControl('familienstand', this.familienstand);
    }
}
