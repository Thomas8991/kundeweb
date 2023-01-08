import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { NgIf } from '@angular/common';
// import { EMAIL_REGEX } from '../shared';
import log from 'loglevel';

/**
 * Komponente mit dem Tag &lt;hs-create-email&gt;, um das Erfassungsformular
 * f&uuml;r einen neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-email',
    templateUrl: './create-email.component.html',
    imports: [FormsModule, NgIf, ReactiveFormsModule],
    standalone: true,
})
export class CreateEmailComponent implements OnInit {
    @Input()
    createForm!: FormGroup;

    readonly email = new FormControl(
        undefined,
        // Validators.required,
        // Validators.pattern(....),
    );

    ngOnInit() {
        log.debug('CreateEmailComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.createForm.addControl('email', this.email);
    }
}
