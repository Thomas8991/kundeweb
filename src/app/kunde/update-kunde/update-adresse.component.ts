import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { type Adresse } from '../shared/adresse';
import log from 'loglevel';

/**
 * Komponente f&uuml;r den CSS-Selektor <code>hs-update-adresse</code>
 */
@Component({
    selector: 'hs-update-adresse',
    templateUrl: './update-adresse.component.html',
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class UpdateAdresseComponent implements OnInit {
    // <hs-update-adresse [form]="form" [currentValue]="...">
    @Input()
    form!: FormGroup;

    @Input()
    currentValue!: Adresse;

    protected adresse!: FormControl;

    ngOnInit() {
        log.debug(
            'UpdateAdresseComponent.ngOnInit: currentValue=',
            this.currentValue,
        );
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.adresse = new FormControl(this.currentValue, Validators.required);
        this.form.addControl('adresse', this.adresse);
    }
}
