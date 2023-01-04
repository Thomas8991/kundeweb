import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import log from 'loglevel';

/**
 * Komponente mit dem Tag &lt;hs-create-interessen&gt;, um das Erfassungsformular
 * f&uuml;r einen neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-interessen',
    templateUrl: './create-interessen.component.html',
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class CreateInteressenComponent implements OnInit {
    @Input()
    createForm!: FormGroup;

    readonly sport = new FormControl(false);

    readonly lesen = new FormControl(false);

    readonly reisen = new FormControl(false);

    ngOnInit() {
        log.debug('CreateInteressenComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.createForm.addControl('sport', this.sport);
        this.createForm.addControl('lesen', this.lesen);
        this.createForm.addControl('reisen', this.reisen);
    }
}
