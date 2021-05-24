import { compose, on, lens } from "../lenses";

interface Person {
    name: string;
    age: number;
    address: Address;
}

interface Address {
    street: { name: string };
    number: number;
}

const person: Person = {
    name: "Mary Cassatt",
    age: 35,
    address: {
        street: { name: "Painters St" },
        number: 1,
    },
};

describe("lenses", () => {
    describe("on (object lenses)", () => {
        it("should get inner value", () => {
            const streetName = on(person).address.street.name._.get();
            expect(streetName).toEqual("Painters St");
        });

        it("should set inner value", () => {
            const person2 = on(person).address.street.name._.set("Elm St");
            expect(person2.address.street.name).toEqual("Elm St");
        });
    });

    describe("lens (non-object lens)", () => {
        const streetNameL = lens<Person>().address.street.name;

        it("should get inner value", () => {
            const streetName = streetNameL._.get(person);
            expect(streetName).toEqual("Painters St");
        });

        it("should set inner value", () => {
            const person2 = streetNameL._.set(person, "Elm St");
            expect(person2.address.street.name).toEqual("Elm St");
        });
    });

    describe("compose", () => {
        const streetNameL = compose(lens<Person>().address, lens<Address>().street.name);

        it("should get inner value", () => {
            const streetName = streetNameL._.get(person);
            expect(streetName).toEqual("Painters St");
        });

        it("should set inner value", () => {
            const person2 = streetNameL._.set(person, "Elm St");
            expect(person2.address.street.name).toEqual("Elm St");
        });
    });
});
