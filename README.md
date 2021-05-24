# yalens

Typed immutable lenses.

## Motivation

Make a immutable update of a nested value as simple as a mutable update:

```typescript
// Imperative: update in-place:
person.address.city.name = "Paris";

// Functional: immutable update, return a new object. With auto-complete support:
const newPerson = on(person).address.city.name._.set("Paris");
```
