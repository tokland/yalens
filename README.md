# yalens

Simple immutable lenses with Typescript support.

## Motivation

Make functional, immutable updates of nested values of objects as simple as imperative, mutable updates:

```typescript
// Imperative, update in-place.
person.address.city.name = "Paris";

// Functional, immutable update, with auto-complete.
const newPerson = on(person).address.city.name._.set("Paris");
```
