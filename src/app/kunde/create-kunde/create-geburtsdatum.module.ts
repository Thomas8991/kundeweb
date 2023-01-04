import { CalendarModule, DateAdapter } from 'angular-calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateGeburtsdatumComponent } from './create-geburtsdatum.component';
import { NgModule } from '@angular/core';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// Exportierte Komponenten koennen bei einem importierenden Modul in dessen
// Komponenten innerhalb deren Templates (= HTML-Fragmente) genutzt werden.
@NgModule({
    imports: [
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [CreateGeburtsdatumComponent],
    exports: [CreateGeburtsdatumComponent],
})
export class CreateGeburtsdatumModule {}
