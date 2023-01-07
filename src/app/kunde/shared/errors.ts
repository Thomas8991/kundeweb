/* eslint-disable max-classes-per-file, no-useless-constructor, no-empty-function */

export class FindError {
    constructor(readonly statuscode: number, readonly cause?: Error) {}
}

export class SaveError {
    constructor(readonly statuscode: number, readonly cause?: Error | string) {}
}

export class UpdateError {
    constructor(readonly statuscode: number, readonly cause?: Error | string) {}
}

export class RemoveError {
    constructor(readonly statuscode: number) {}
}

/* eslint-enable max-classes-per-file, no-useless-constructor, no-empty-function */
