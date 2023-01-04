import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import log from 'loglevel';

/**
 * Komponente mit dem Tag &lt;hs-create-kategorie&gt;, um das Erfassungsformular
 * f&uuml;r einen neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-kategorie',
    templateUrl: './create-kategorie.component.html',
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class CreateKategorieComponent implements OnInit {
    @Input()
    createForm!: FormGroup;

    readonly kategorie = new FormControl(undefined);

    ngOnInit() {
        log.debug('CreateKategorieComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.createForm.addControl('kategorie', this.kategorie);
    }
}
