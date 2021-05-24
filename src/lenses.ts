/* Generic */

type IsArray<T> = T extends unknown[] ? true : false;

type IsObject<T> = T extends object ? (IsArray<T> extends true ? false : true) : false;

/* Lenses */

type FnsType = "free" | "object";

type GetFns<From, To, FnsT> = FnsT extends "free" ? FnsFree<From, To> : FnsObject<From, To>;

interface FnsFree<From, To> {
    get: (from: From) => To;
    set: (from: From, value: To) => From;
}

interface FnsObject<From, To> {
    get: () => To;
    set: (value: To) => From;
}

type ObjectProps<From, To, FnsT extends FnsType> = {
    [K in keyof To]: Lens<From, To[K], FnsT>;
};

type Props<From, To, FnsT extends FnsType> = IsObject<To> extends true
    ? ObjectProps<From, To, FnsT>
    : {};

type Lens<From, To, FnsT extends FnsType> = Props<From, To, FnsT> & {
    _: GetFns<From, To, FnsT>;
};

type FreeLens<From, To> = Lens<From, To, "free">;

type ObjectLens<From, To> = Lens<From, To, "object">;

function composeFns<From, To1, To2>(
    fns1: FnsFree<From, To1>,
    fns2: FnsFree<To1, To2>
): FnsFree<From, To2> {
    return {
        get: obj => {
            //         <-   lens1   ->  <----   lens2   --->       <-obj->
            // compose(personS.address, addressS.street.name)._.get(person);
            const obj2 = fns1.get(obj);
            return fns2.get(obj2);
        },
        set: (obj, value) => {
            //         <-    lens1  ->  <----   lens2   --->       <-obj->  <-value->
            // compose(personS.address, addressS.street.name)._.set(person, "Elm St");
            const obj2 = fns1.get(obj);
            const obj2Updated = fns2.set(obj2, value);
            return fns1.set(obj, obj2Updated);
        },
    };
}

function buildFns<From, To>(prop_: string | symbol, fns: FnsFree<From, To>) {
    const prop = prop_ as keyof To;
    const fnsForObject: FnsFree<To, To[typeof prop]> = {
        get: obj => obj[prop],
        set: (obj, value) => ({ ...obj, [prop]: value }),
    };

    return composeFns(fns, fnsForObject);
}

function getFreeLens<From, To>(fns: FnsFree<From, To>): FreeLens<From, To> {
    const handler: ProxyHandler<FreeLens<From, To>> = {
        get(_target, prop_, _receiver) {
            if (prop_ === "_") {
                return fns;
            } else {
                const composedFns = buildFns<From, To>(prop_, fns);
                return getFreeLens(composedFns);
            }
        },
    };

    return new Proxy({} as FreeLens<From, To>, handler);
}

function getObjectLens<From, To>(obj: From, fns: FnsFree<From, To>): ObjectLens<From, To> {
    const handler: ProxyHandler<ObjectLens<From, To>> = {
        get(_target, prop_, _receiver) {
            if (prop_ === "_") {
                const fnsObject: FnsObject<From, To> = {
                    get: () => fns.get(obj),
                    set: value => fns.set(obj, value),
                };
                return fnsObject;
            } else {
                const composedFns = buildFns<From, To>(prop_, fns);
                return getObjectLens(obj, composedFns);
            }
        },
    };

    return new Proxy({} as ObjectLens<From, To>, handler);
}

const identityFns: FnsFree<unknown, unknown> = {
    get: obj => obj,
    set: (_obj, value) => value,
};

/* Public interface */

export function lens<T>(): FreeLens<T, T> {
    return getFreeLens(identityFns as FnsFree<T, T>);
}

export function on<T>(obj: T): ObjectLens<T, T> {
    return getObjectLens(obj, identityFns as FnsObject<T, T>);
}

export function compose<From, To1, To2>(
    lens1: FreeLens<From, To1>,
    lens2: FreeLens<To1, To2>
): FreeLens<From, To2> {
    const composedFns = composeFns(lens1._, lens2._);
    return getFreeLens<From, To2>(composedFns);
}
y
