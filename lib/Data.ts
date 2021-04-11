class Data {

    private _id: string;
    private _finish: boolean|undefined;
    private _chunk: any|undefined;
    private _options: any|undefined;

    constructor(id: string, finish: boolean|undefined, chunk: any|undefined, options: any|undefined) {

        this._id = id;
        this._finish = finish;
        this._chunk = chunk;
        this._options = options;

    }

    static getInstance(obj: any): Data {

        return new Data(obj._id, obj._finish, obj._chunk, obj._options);

    }

    get id(): string {

        return this._id;

    }

    set id(value: string) {

        this._id = value;

    }

    get finish(): boolean|undefined {

        return this._finish;

    }

    set finish(value: boolean|undefined) {

        this._finish = value;

    }

    get chunk(): any|undefined {

        return this._chunk;

    }

    set chunk(value: any|undefined) {

        this._chunk = value;

    }

    get options(): any|undefined {

        return this._options;

    }

    set options(value: any|undefined) {

        this._options = value;

    }

}

export default Data;
