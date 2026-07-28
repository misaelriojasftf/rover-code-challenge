export class SitterRepository {
    _notImplementError(method) {
        throw Error(`${method}() not implemented`);
    }

    findAll() {
        this._notImplementError('findAll');
    }

    printAll() {
        this._notImplementError('printAll');

    }
}
