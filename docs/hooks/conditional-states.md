# Conditional states

A conditional state is an agent state that only runs while something is switched on, usually a settings group that
can be switched off. It implements `App\Contracts\Work\ConditionalState`:

```php
interface ConditionalState
{
    public function isEnabled(): bool;
}
```

A state that does not implement it is always enabled. Core's ready states never implement it.

## Writing one

Read the settings a state depends on inside the state type's `statesFor`, never in the factory's constructor. A state
type is built once and kept for the life of a worker, so a reader taken in its constructor would belong to whichever
request happened to build it. Take `App\Settings\Support\CurrentSettingsReader` instead and ask it for the reader of the
request running now, once per batch:

```php
final readonly class ReviewStateType implements StateLoader
{
    public function __construct(private ReviewSettings $settings, private CurrentSettingsReader $currentSettings) {}

    public function statesFor(StateReferences $references): StateSet
    {
        $review = $this->currentSettings->reader()->group($this->settings->review);

        return StateSet::build($references, fn (): AgentState => new ReviewState($review, $this->settings));
    }
}
```

The state keeps the group view it was given and answers from it:

```php
final class ReviewState extends AgentState implements ConditionalState
{
    public function isEnabled(): bool
    {
        return $this->review instanceof EnabledSettingsGroup;
    }
}
```

`isEnabled()` reads only what the state captured when it was built. It does no I/O, has no side effects and gives the
same answer every time for one frame. It never hides an error: a settings read that fails raises `SettingsUnavailable`
in `statesFor`, and an invalid stored switch raises `SettingStorageInvalid`; neither becomes "off". The state reads its
group's settings only while the group is enabled. The full example is the Reviews fixture in
`tests/Fixtures/Domains/Reviews/States`.

A `BooleanSetting` whose value is false is an ordinary value the state may read. It does not switch the state off; only
a toggle group, read through `group()`, decides participation.

## What the stack does with it

- **Push.** `AgentStack::withStateOnTop` builds the frame and returns the same stack when the frame is not enabled,
  exactly as it does for a state that is already on the stack. The push stores nothing and raises nothing, the void
  `push` contracts stay as they are, and the hook trace still records the push the state asked for.
- **Hooks.** The hook walk skips a frame that is finished or not enabled, so a switched-off frame never answers and the
  frames beneath it answer as usual.
- **Storage.** A switched-off frame stays stored, like a finished one. An ordinary hook saves the stack unchanged; only an
  explicit transition removes frames, and then only the frame it names plus the inactive frames exposed at the top
  (`AgentStack::withoutExposedInactive()`). A switched-off frame buried under a live one stays, still counts towards
  `AgentStack::DEEPEST`, and answers again once its group is switched back on. Removing it never finishes its subject.
- **Restore.** `StackRestorer::restore` stays read-only: it still builds and validates every stored frame, a switched-
  off one included (subject and schema checks), and writes nothing.
- **Switching back on.** Enabling the group again makes future pushes eligible again. It does not bring back a frame
  that an explicit transition removed while the group was off, and it does not replay a push that was declined.

## Integration rule for hooks and ticks

For the hook walk and doc 35 revision 3's ticker:

- **Hooks.** The hook walk and a push start from the stored stack as it is and ask only live frames.
- **Ticks.** The ticker skips a switched-off candidate both when it selects frames to tick and when it revalidates one,
  without pruning it from the stack (`TickCandidates::restore`). A domain wrapper around a ticking loader keeps the
  `TickableStateLoader` mark (`DomainTickableStateType`). A skipped tick advances no timing baseline.

The ticker follows the tick rule above.
