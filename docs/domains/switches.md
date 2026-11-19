# Domain switches

The journal's owner can switch a domain off and on again. A switched-off domain stays installed: its providers,
migrations, state types, settings declarations and exported PHP types stay registered, and its records stay as they
are. Only the domain's runtime work stops until it is switched on again.

## The switch

Every domain that can be switched off gets one Core settings group, generated at start-up by
`DomainRegistry::domainSwitches()` and registered with Core's own settings:

```php
ToggleGroup::make('domain_plans', 'Plans', true, []);
```

The key is `domain_` and the lowercased domain name. Each switch is on by default and holds no settings. Core has no
switch. Access has none either: `AccessDomain::canDisable()` answers false, because signing in and the owner policy are
needed to switch anything back on. A domain that can never be switched off may only require domains that cannot be
either (`AlwaysOnDomainRequiresSwitchable` stops the boot otherwise).

The owner uses the ordinary settings group commands, with the revision the settings catalogue shows:

- `DisableSettingGroup(new GroupReference('Core', 'domain_plans'), $revision)` switches Plans off.
- `EnableSettingGroup(...)` switches it on.
- `ResetSettingGroup(...)` returns it to its default, on.

There is no separate route, screen or command for switches.

## Configured and effective availability

The switch is what the owner configured; availability is what the journal acts on. `App\Contracts\DomainAvailability`
answers `isEnabled(string $owner)`: Core and a domain that cannot be switched off are always available, and a
switchable domain is available while its switch is on and every domain it requires is available. One answer reads
Core's settings once.

Turning Tasks off therefore makes Plans unavailable too, because Plans requires Tasks, while Plans' own switch stays on.
Turning Tasks on again makes Plans available again. Switching Plans off itself keeps it off after Tasks returns. No
switch is ever rewritten to follow another. For diagnostics and a later settings screen,
`SettingsDomainAvailability::status()` gives a `DomainStatus` with the switch as configured, the effective availability
and the names of the required domains that are not available. A stored switch that is not a boolean raises
`SettingStorageInvalid`; it is never read as on or off.

## What a switched-off domain stops

- **Commands.** A command of an unavailable domain stays registered and is refused with
  `App\Bus\Exceptions\DomainDisabled` after Core's first steps (logging and the actor check), before its handler or any
  of its middleware is built. The same holds for users, agents and services. Its middleware is also left out of other
  owners' commands without being built; Core's middleware always runs.
- **Pages and actions.** They answer a plain 404, the same as a page that does not exist.
- **Sections, windows and the inspector.** Contributions of an unavailable domain are left out before their readers
  run, on full and partial requests alike.
- **Navigation and counts.** Its items, and items that open its pages, are left out before their children or counts
  are read; other items stay.
- **Runtime listeners.** A listener of an unavailable domain is skipped when the event is delivered. The gate asks the
  listener's own domain, not the domain that raised the event. The discovered and the cached event maps get the same
  gate.
- **Agent states.** A push of a state whose domain is unavailable is declined before its subject is read, like a
  push of a state already on the stack. A stored frame of that domain still loads and validates, reports itself off,
  is skipped by hooks and leaves the stack on the next real operation, as a finished frame does.

## What it does not stop

- **Settings.** The domain's own settings read and change as before, so the owner can configure it before switching it
  on.
- **Exported contracts.** Bindings and interfaces stay as they are; there is no off-result wrapper.
- **Registration.** Listeners that collect declarations, such as the `StateTypesRequested` registration of state types,
  always run.
- **Records.** Nothing is deleted, hidden in storage or rewritten.

## Skipped listeners and their consequences

| Listener | While its domain is off | Recovery |
| --- | --- | --- |
| Tasks `PushTaskState`, Sequences `PushSequenceState` | An event does not push its state. | Switching back on does not push the missed state; a later legitimate action may push it. The earlier subject operation is not undone. |
| Plans `RaisePlanProgressChanged` | The plan progress notification is not raised. | Nothing to repair: fresh reads derive progress from the current records. |
| Rules `SupplyHookContext` | That compaction gets no rules reminders. | Later compactions read the current rules; no past context is replayed. |
| Memory `LowerMemoryWeights` | That compaction neither lowers memory weights nor adds memory reminders. | Weights stay as they were for missed compactions; later compactions resume without catching up. |
| Documents `CloseEndedSessionDraft` | A draft may stay held after its session ends. Its data is kept, never published. | After switching on, an authorized user recovers the abandoned draft through `RecoverDocument` (`DraftClosing::recover`). |

Messaging, its facts and the answering frames live in Core (`app/Communication`), so they are never gated.

## Switching back on

Switching a domain on again makes it eligible again from then on: its commands run, its pages show, its listeners hear
new events and its states can be pushed. Nothing that was skipped while it was off is buffered or replayed, and a
frame removed while it was off does not come back.
