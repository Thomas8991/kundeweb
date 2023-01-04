import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import log from 'loglevel';

/**
 * Komponente mit dem Tag &lt;hs-create-newsletter&gt;, um das Erfassungsformular
 * f&uuml;r einen neuen Kunden zu realisieren.
 */
@Component({
    selector: 'hs-create-newsletter',
    templateUrl: './create-newsletter.component.html',
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class CreateNewsletterComponent implements OnInit {
    @Input()
    createForm!: FormGroup;

    readonly newsletter = new FormControl(false);

    ngOnInit() {
        log.debug('CreateNewsletterComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.createForm.addControl('newsletter', this.newsletter);
    }
}
