# Numbered and unnumbered models

Every record has a ULID key that machines use. A record that users talk about, such as plan 12 or task 47, also
has a number. This guide says what each model needs; the model alone says it is numbered and how.

## Every model

Every model is keyed by a ULID, can be linked to any other record, and lists its fillable columns:

```php
#[Fillable(['name'])]
final class GlobalGroup extends Model
{
    use HasUlids, Linkable;
}
```

- The migration keys the table with `$table->ulid('id')->primary()`, references another table with
  `foreignUlid(...)`, and a polymorphic reference with `ulidMorphs(...)`.
- A pivot table's model extends `Pivot`, or `MorphPivot` when a side is polymorphic (rule 33).
- `DomainModelConventionTest` fails on a model without `HasUlids`, without `Linkable` or without an explicit
  `#[Fillable]`; `TableModelTest` fails on a table without a model and on a pivot table whose model extends `Model`.
- Code reaches rows only through the model's scopes and methods: `DomainTableBoundaryTest` fails on `DB::table()`,
  `DB::select()` and other raw row access. A `DB::statement('ALTER TABLE ...')` for a check constraint is allowed.

## A numbered model

A record users refer to by number implements `Numbered` and uses `HasNumber`:

```php
final class Phase extends Model implements Assignable, Numbered
{
    use HasNumber, HasUlids, Linkable;

    /**
     * A phase is numbered within its plan: plan 12's phase 2.
     */
    public function numberHolder(): Model
    {
        return $this->plan;
    }
}
```

- By default a record is numbered across the journal: `numberHolder()` is the journal's own group. A record
  numbered within a parent returns its saved parent, as a phase returns its plan.
- Its table carries `number_group_id` (a `foreignUlid` to `number_groups`), `number` (an unsigned big integer), the
  unique pair of the two and a check that the number is above zero. That is all a new table declares: there is no
  conversion step, because until version 6 is released a schema change edits the create migration (rule 34).
- A number is given once, when the record is created, and never changes: changing it throws `NumberChanged`.
  Phases are ordered by their number; they have no position.

## Nothing is declared in the domain

A domain lists no numbered model. Once every link type is registered, the journal finds each model with a link type
that implements `Numbered`, and checks it: a model that implements `Numbered` without `HasNumber`, or that shares a
table with another numbered model, stops the boot. The number allocator refuses a record whose link type names no such
model. A new numbered model needs a link type, `Numbered` and `HasNumber`, and nothing in its domain class.

## Creating numbered records

A numbered record is created only inside a bus command, such as `CreateTask`, `AddPhase` or `RememberForAgent`: the
allocator locks the holder and its number group in the command's transaction, and refuses with
`CommandTransactionMissing` outside one. Only the database seeder and the tests may number outside a command, through
`NumberingOutsideCommands::allow()`.

## Routes and references

- Pages users open name a record by number: `/plans/12`. The request reads the number with the `ReadsRouteNumber`
  trait and finds the record with `idOfNumber`; a number no record has is not found:

  ```php
  public function planId(): string
  {
      return Plan::idOfNumber($this->routeNumber('plan')) ?? throw new NotFoundHttpException;
  }
  ```

- Agent and machine routes take ULIDs.
- `RecordReference` is the one parser for numbers users type: `RecordReference::parse('plan 12')`, and
  `RecordReference::within($plan, 'phase', 2)->label()` reads `plan 12, phase 2`. A number with a sign, a leading
  zero, an exponent or spaces is refused with `InvalidRecordReference`.

## An unnumbered model

A model nobody refers to by number, such as a link, an assignment or a number group, has a ULID key only: it
implements no `Numbered` and its table has no `number` column.
