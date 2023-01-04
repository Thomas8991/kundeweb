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
 * Komponente mit dem Tag &lt;hs-create-homepage&gt;, um das Erfassungsformular
 * f&uuml;r einen neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-homepage',
    templateUrl: './create-homepage.component.html',
    imports: [FormsModule, NgIf, ReactiveFormsModule],
    standalone: true,
})
export class CreateHomepageComponent implements OnInit {
    @Input()
    createForm!: FormGroup;

    readonly homepage = new FormControl(undefined);

    ngOnInit() {
        log.debug('CreateHomepageComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.createForm.addControl('homepage', this.homepage);
    }
}
