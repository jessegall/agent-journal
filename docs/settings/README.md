# Settings

Settings are installation-wide, non-secret values that Core and each domain declare in code and the journal's owner
can change. Every setting has a typed default; a stored override replaces that default until it is reset. This guide
shows how a domain declares settings, reads them at runtime and changes them, using the Reviews test fixture
(`tests/Fixtures/Domains/Reviews`) as the example throughout.

## Declaring settings

A domain that has settings implements `App\Settings\Contracts\SettingsProvider` on its Domain class and returns a
separate final definition class. The definition implements `SettingsDefinition`: each setting and group is a typed
readonly property, assigned once in the constructor, and each setting is listed in exactly one group.

```php
final class ReviewsDomain extends Domain implements SettingsProvider
{
    public function settings(): ReviewSettings
    {
        return new ReviewSettings;
    }
}

final class ReviewSettings implements SettingsDefinition
{
    public readonly IntegerSetting $retryLimit;

    public readonly ToggleGroup $review;

    public readonly StringSetting $title;

    public readonly SettingGroup $general;

    public function __construct()
    {
        $this->retryLimit = IntegerSetting::make('retry_limit', 'Retry limit', 3, minimum: 0, maximum: 10);
        $this->review = ToggleGroup::make('review', 'Review', true, [$this->retryLimit]);
        $this->title = StringSetting::make('title', 'Title', 'Reviews', minimumLength: 1);
        $this->general = SettingGroup::make('general', 'General', [$this->title]);
    }

    public function groups(): array
    {
        return [$this->general, $this->review];
    }
}
```

Core collects every definition once at start-up and registers it under the domain's name; Core's own settings
(`CoreSettings`, a General group with `display_name`) come first. A wrong declaration stops the application at boot
with `SettingDeclarationInvalid`, which names the key and never a value.

### Keys, labels and limits

- A key is lowercase letters, digits and underscores, starts with a letter and has at most 64 characters
  (`SettingKey::KEY_CHARACTERS`). Keys are unique within an owner across all its groups; group keys are unique too.
- A label is plain text, not empty, at most 200 characters (`SettingKey::LABEL_CHARACTERS`).
- An owner declares at most 500 settings (`SettingRegistry::SETTINGS_PER_OWNER`) and 100 groups
  (`SettingRegistry::GROUPS_PER_OWNER`). A choice setting has at most 500 options (`ChoiceOptions::MOST`).
- A text setting holds at most 16 KiB of UTF-8 (`StringSetting::LONGEST`).
- A whole number stays within ±(2^53 − 1) (`IntegerSetting::SMALLEST` and `LARGEST`), so a browser keeps it exactly.
- A decimal has a precision of 1 to 30 digits and a scale of 0 to 12 fractional digits
  (`DecimalSetting::MOST_DIGITS`, `MOST_FRACTIONAL_DIGITS`).
- Every default is mandatory and must be a value the setting accepts. Groups do not nest.

### Every declaration type

```php
// Text, with byte lengths.
StringSetting::make('title', 'Title', 'Reviews', minimumLength: 1);

// On or off.
BooleanSetting::make('notify_owner', 'Notify the owner', true);

// Whole number between bounds.
IntegerSetting::make('retry_limit', 'Retry limit', 3, minimum: 0, maximum: 10);

// Exact decimal: never a float, never rounded; a value with more fractional digits is refused.
DecimalSetting::make('weight', 'Weight', Decimal::parse('0.50'), precision: 5, scale: 2);

// One of a fixed list of text options, or of whole-number options; '01' and '1' are different options.
ChoiceSetting::make('summary_style', 'Summary style', 'short', [Choice::make('short', 'Short'), Choice::make('long', 'Long')]);
ChoiceSetting::make('priority', 'Priority', 0, [Choice::make(0, 'Normal'), Choice::make(1, 'High')]);

// One case of a backed enum; the options are its cases, labelled by ChoiceLabel when the enum implements it.
EnumSetting::make('review_mode', 'Review mode', ReviewMode::class, ReviewMode::Quick);

// A plain group is always on; a toggle group can be switched off and has a default state.
SettingGroup::make('general', 'General', [$this->title, $this->priority]);
ToggleGroup::make('review', 'Review', true, [$this->retryLimit, $this->notifyOwner]);
```

## Using the registered definition

Inject the definition class; the container hands out the one object Core registered. A setting is known by that exact
object, so a declaration built by hand, even with the same key, raises `SettingHandleUnknown`.

```php
public function __construct(private ReviewSettings $settings, private SettingsReader $reader) {}
```

## Reading values at runtime

`App\Settings\Contracts\SettingsReader` gives the current value of a setting: its stored override, or its default.
Runtime reads need no actor, so they work in scheduled jobs and listeners. The reader is scoped: within one request or
job it reads each owner's record once, and the next request starts fresh.

```php
$title = $this->reader->string($this->settings->title);
$priority = $this->reader->integerChoice($this->settings->priority);
```

The typed methods are `string`, `boolean`, `integer`, `decimal` (an exact `Decimal`), `stringChoice`, `integerChoice`
and `enum` (which returns the case of the enum the setting declares).

A setting inside a toggle group is never read on its own: `GroupSnapshotRequired` is raised whether the group is on
or off, so code cannot work only while the group happens to be on. Read the group once and branch:

```php
$review = $this->reader->group($this->settings->review);

if ($review instanceof DisabledSettingsGroup) {
    return;
}

$limit = $review->integer($this->settings->retryLimit);
$mode = $review->enum($this->settings->reviewMode);
```

An `EnabledSettingsGroup` answers only for its own settings (`SettingUnavailable` otherwise), all from one revision; a
later change does not alter a group already read. To read many values at once, take one snapshot of the owner:

```php
$snapshot = $this->reader->snapshot($this->settings);
$title = $snapshot->string($this->settings->title);
$review = $snapshot->group($this->settings->review);
```

A snapshot reads the owner's record once and lives no longer than the request or job that took it.

A stored value the setting no longer accepts raises `SettingStorageInvalid` when it is read; it is never replaced by
the default quietly. A database failure raises `SettingsUnavailable`, never a default.

## Changing values

Only the journal's owner changes settings, through the command bus. `App\Settings\Contracts\SettingCommands` builds the
typed commands from the registered declarations; building a command grants nothing, and its handler checks the actor,
the value, the revision and the group again.

```php
$catalogue = $this->catalogue->owner('Reviews');

$change = $this->bus->run($this->commands->integer($this->settings->retryLimit, 4, expectedRevision: $catalogue->revision));
```

The factory methods are `string`, `boolean`, `integer`, `decimal`, `stringChoice`, `integerChoice`, `enumString` and
`enumInteger` (they carry the case's backing value, never the case), `reset`, `enable`, `disable` and `resetGroup`.

Every command returns a `SettingsChange` with the owner, the revision after it, and an outcome:

- `SettingsOutcome::Changed`: the stored settings changed and the revision rose by exactly one. Setting a value equal
  to the default still stores an override.
- `SettingsOutcome::Unchanged`: the same value, switch or absence was already stored; the revision stays.
- `SettingsConflict`: the command was made against an older revision. Read again and decide whether to retry; a stale
  command is refused even when its value matches.

A setting in a switched-off group cannot be set or reset (`SettingDisabled`); switching a group off or on never touches
its settings' values. Each changing command raises one `SettingsChanged` event after it commits, with the owner, the
target (`SettingTarget::Setting` or `Group`), the key and the revision, never the value.

## Invalid values and repair

The owner's catalogue (`App\Settings\Contracts\SettingsCatalogue`) shows an invalid stored value as invalid, with its
address and the revision, without showing what was stored. Resetting that setting at that revision removes only that
entry and keeps every other stored entry exactly as it was, unknown and invalid ones included. A toggle whose stored
switch is not a boolean makes its group invalid; resetting the group with `resetGroup` repairs it.

A document that is broken as a whole (not JSON, a wrong envelope, a duplicate key, more than 512 KiB) raises
`SettingsDocumentInvalid`. No single entry can be reset safely then; an operator must look at the stored record.

## Access

- Runtime reads are trusted in-process calls and need no actor. Never expose `SettingsReader` through an HTTP route,
  a command line or any other endpoint.
- The catalogue and every command are for the journal's owner only: agents, other users and requests with nobody
  acting are refused with `SettingsAccessDenied` before anything is read. `SettingsAccessPolicy` decides; Settings
  denies everyone by default and Web binds the owner policy.
- Settings are not for secrets. Keys, tokens and passwords stay in the credential and environment mechanisms.
- A production domain that starts depending on a setting ships an owner-reachable reset for it in the same change, so
  the owner can always repair a value the code depends on.
- A domain reads another domain's settings only through that domain's exported definition class and a declared
  required-domain relation.
- `Domain\Access\Support\AccessSettings` is configuration-backed owner identity, not a settings definition. A future
  settings definition for Access would be named `AccessSettingDefinitions`.
