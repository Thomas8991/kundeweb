import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import log from 'loglevel';

/**
 * Komponente f&uuml;r den CSS-Selektor <code>hs-update-kategorie</code>
 */
@Component({
    selector: 'hs-update-kategorie',
    templateUrl: './update-kategorie.component.html',
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class UpdateKategorieComponent implements OnInit {
    @Input()
    form!: FormGroup;

    @Input()
    currentValue: number | undefined;

    protected kategorie!: FormControl;

    ngOnInit() {
        log.debug(
            'UpdateKategorieComponent.ngOnInit: currentValue=',
            this.currentValue,
        );
        this.kategorie = new FormControl(this.currentValue);
        this.form.addControl('kategorie', this.kategorie);
    }
}
