# Sharing: writing a share provider

A domain makes its records shareable in three steps: the model says what it is and how it reaches other records, a
provider reads it for a share, and the domain registers both. Core never names the domain; the domain names only what
Core exports.

## 1. The model is Shareable

The model implements `App\Records\Contracts\Shareable`:

- `shareIdentity(): RecordIdentity` returns the record by its link alias and ULID.
- `static shareRelations(): ShareRelationSet` returns the relations fixed for the whole type:
  `ShareRelationSet::owned('comments', 'share-comment')` for children the provider reads itself,
  `ShareRelationSet::linked('records', 'share-linked-record')` for linked records the owner selects, or
  `ShareRelationSet::none()`. Sets combine with `with()`.

Relations are read once at boot. A relation that needs a capability no registered record advertises stops the boot
with `ShareRelationInvalid`.

## 2. The provider

The provider implements `App\Records\Contracts\ShareRecordProvider`:

- `mayDisclose(RecordIdentity)`: whether the record may be public now, by the type's own policy.
- `preview(ShareSelection, ShareBudget)`: the root's `ShareRecordCard` (identity, safe title, published version).
- `readTargets(ShareTargetRead, ShareBudget)`: one batch of linked targets of this type, as `ShareRecords` with the
  eligible cards apart from the ineligible identities. Never a body, never a count of what is hidden.
- `readRelated(ShareRelationRead, ShareBudget)`: one page of an owned relation, at most 100, with a continuation.
- `content(ShareContentRead, ShareBudget)`: the published content, as `SharedContent`.

Every call gets an `App\Records\Contracts\ShareBudget`. Core runs each call inside it and counts its queries; the
provider charges what it loads: `chargeText` for bodies, `chargeMetadata` for titles and excerpts, and
`chargeRecords` and `chargeLinks` for what it reaches. Measure a large field before loading it:
`DocumentShareProvider` reads a body's length with the database's `octet_length` and refuses a body over the limit
before selecting it.

Read through a named query of what the type publishes, and select only the columns a card needs.
`domain/Documents/src/Support/DocumentShareProvider.php` and `domain/Plans/src/Support/PlanShareProvider.php` are
complete examples.

## 3. Registration

The domain class implements `App\Records\Contracts\ShareRecordContributor` and returns one `ShareRecordDefinition`
per type: the alias, the model class, the provider class and the capabilities the type advertises, such as
`share-linked-record` for a record the owner may select as a linked record. Core's `SharingServiceProvider` registers
every domain that declares it at boot.

## Trust

Installed PHP providers are trusted, cooperative code. Budgets and database time limits bound their work, but they
cannot stop an endless PHP loop, and providers run without a sandbox.
