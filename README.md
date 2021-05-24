# yalens

Simple immutable lenses with Typescript support.

## Motivation

Make functional immutable updates of nested values in objects as simple as a mutable update, with auto-complete support:

```typescript
// Imperative, update in-place.
person.address.city.name = "Paris";

// Functional, immutable update, with auto-complete.
const newPerson = on(person).address.city.name._.set("Paris");
```
