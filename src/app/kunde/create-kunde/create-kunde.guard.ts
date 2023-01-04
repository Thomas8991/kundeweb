import {
    type ActivatedRouteSnapshot,
    type CanDeactivate,
    type RouterStateSnapshot,
    type UrlTree,
} from '@angular/router';
import { type CreateKundeComponent } from './create-kunde.component';
import { Injectable } from '@angular/core';
import { type Observable } from 'rxjs';
import log from 'loglevel';

// https://angular.io/api/router/CanDeactivate
// https://angular.io/guide/router#can-deactivate-guard

@Injectable({ providedIn: 'root' })
export class CreateKundeGuard implements CanDeactivate<CreateKundeComponent> {
    constructor() {
        log.debug('CreateKundeGuard.constructor()');
    }

    canDeactivate(
        createKunde: CreateKundeComponent,
        _: ActivatedRouteSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
        __: RouterStateSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
    ):
        | Observable<UrlTree | boolean>
        | Promise<UrlTree | boolean>
        | UrlTree
        | boolean {
        if (createKunde.fertig) {
            // Seite darf zur gewuenschten URL verlassen werden
            return true;
        }

        createKunde.showWarning = true;
        createKunde.fertig = true;
        log.debug('CreateKundeGuard.canDeactivate: Verlassen der Seite');
        return false;
    }
}
