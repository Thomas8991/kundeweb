import { Component, Input, type OnInit } from '@angular/core';
import {
    FormControl,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { type GeschlechtType } from '../shared/kunde';
import log from 'loglevel';

@Component({
    selector: 'hs-update-geschlecht',
    templateUrl: './update-geschlecht.component.html',
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class UpdateGeschlechtComponent implements OnInit {
    @Input()
    form!: FormGroup;

    @Input()
    currentValue: GeschlechtType | '' | undefined;

    protected geschlecht!: FormControl;

    ngOnInit() {
        log.debug(
            'UpdateGeschlechtComponent.ngOnInit: currentValue=',
            this.currentValue,
        );
        this.geschlecht = new FormControl(this.currentValue);
        this.form.addControl('geschlecht', this.geschlecht);
    }
}
