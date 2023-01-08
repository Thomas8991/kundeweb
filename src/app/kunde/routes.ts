import { CreateKundeComponent } from './create-kunde/create-kunde.component';
import { DetailsKundeComponent } from './details-kunde/details-kunde.component';
import { HomeComponent } from '../home/home.component';
import { UpdateKundeComponent } from './update-kunde/update-kunde.component';
// eslint-disable-next-line sort-imports
import { type Routes } from '@angular/router';
import { SucheKundenComponent } from './suche-kunden/suche-kunden.component';
import { canDeactivateGuard } from './create-kunde/create-deactivate.guard';

// import { UpdatekundeComponent } from './update-kunde/update-kunde.component';
// import { DetailskundeComponent } from './details-kunde/details-kunde.component';
// import { SucheBuecherComponent } from './suche-buecher/suche-buecher.component';
// import { canDeactivateGuard } from './create-kunde/create-deactivate.guard';
import { isAdminGuard } from '../auth/isAdmin.guard';

// Route-Definitionen fuer das Feature-Modul "kunde":
// Zuordnung von Pfaden und Komponenten mit HTML-Templates
export const ROUTES: Routes = [
    {
        path: 'suche',
        component: SucheKundenComponent,
        title: 'Suche',
    },
    {
        path: 'create',
        component: CreateKundeComponent,
        title: 'Neuer Kunde',
        canMatch: [isAdminGuard],
        canDeactivate: [canDeactivateGuard],
    },
    // {
    //    path: 'create',
    //    component: HomeComponent,
    //    title: 'Beispiel',
    // },

    // id als Pfad-Parameter
    {
        path: 'update/:id',
        component: UpdateKundeComponent,
        canMatch: [isAdminGuard],
    },
    {
        path: 'update/:id',
        component: HomeComponent,
        title: 'Beispiel',
    },
    {
        path: ':id',
        component: DetailsKundeComponent,
    },
];
