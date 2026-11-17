---
name: name-says-kind
description: A class, enum, case, method, property, constant, parameter or variable named with Kind. The project names a category of things with Type, never Kind (rule 22). Read this when a name-says-kind finding points here.
---

# A category is a Type, never a Kind

The project says Type for a category of things: `ActorType`, `StateType`, `PlanType`, `$type`, `holder_type`.
Kind means the same and was used for it before; two words for one idea is how readers start to look for a
difference that is not there, so Kind is not used in any name.

## The fix

Rename the name to Type with the tools, so every reference follows:

- a class, enum or interface: `php tools/refactoring/move.php App\\…\\OrderKind OrderType`
- a method, property or constant: `php tools/refactoring/rename-member.php property App\\…\\Shipment kind type`
- a variable: `php tools/refactoring/rename-member.php variable app/… kind type`

A stored column or a key stored in data changes through a migration that keeps the rows readable.

## Worked example

```php
----------[ Bad ]----------

enum OrderKind: string
{
    case Pickup = 'pickup';
}

----------[ Good ]----------

enum OrderType: string
{
    case Pickup = 'pickup';
}
```
