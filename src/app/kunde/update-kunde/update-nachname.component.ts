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

@Component({
    selector: 'hs-update-nachname',
    templateUrl: './update-nachname.component.html',
    imports: [FormsModule, NgIf, ReactiveFormsModule],
    standalone: true,
})
export class UpdateNachnameComponent implements OnInit {
    @Input()
    form!: FormGroup;

    @Input()
    currentValue!: string;

    protected nachname!: FormControl;

    ngOnInit() {
        log.debug(
            'UpdateNachnameComponent.ngOnInit: currentValue=',
            this.currentValue,
        );
        // prettier-ignore
        this.nachname = new FormControl(this.currentValue, [Validators.required]); // eslint-disable-line max-len
        this.form.addControl('nachname', this.nachname);
    }
}
