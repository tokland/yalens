Perform immutable updates of nested values (almost) as simply as mutable updates:

```typescript
// Imperative: in-place place.
person.address.city.name = "Paris";

// Functional: immutable update, returns a new object.
const newPerson = on(person).address.city.name._.set("Paris");
```

## Examples

### Object lenses

```typescript
import { on } from "yalens";

type Person = { name: string; address: { city: { name: string } } };
const mary: Person = { name: "Mary Cassatt", address: { city: { name: "Allegheny" } } };

const parisianMary = on(mary).address.city.name._.set("Paris");
// { name: "Mary Cassatt", address: { city: { name: "Paris" } } }
```

### Free lenses

A free `lens<Type>()` can be built without having an object yet:

```typescript
import { lens } from "yalens";

const cityNameL = lens<Person>().address.city.name;
const parisianMary = cityNameL._.set(mary, "Paris");
// { name: "Mary Cassatt", address: { city: { name: "Paris" } } }
```

Free lenses can be composed:

```typescript
import { compose, lens } from "yalens";

const cityNameL = compose(lens<Person>().address, lens<Address>().city.name);
const parisianMary = cityNameL._.set(mary, "Paris");
// { name: "Mary Cassatt", address: { city: { name: "Paris" } } }
```

Note that the special accessor `_` also provides a getter:

```typescript
const cityName = cityNameL._.get(mary); // "Allegheny"
```
