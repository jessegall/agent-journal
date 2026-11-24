<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Casts\StoredValuesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\MenuEntryState;
use App\Enums\NavigationCompletion;
use App\Events\Sessions\MenuEntryMarkedStale;
use App\Events\Sessions\MenuEntryProven;
use App\Events\Sessions\MenuEntryRetired;
use App\Events\Sessions\MenuEntrySuperseded;
use App\Events\Sessions\MenuEntryUsed;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Values\EntryGoalAnswer;
use App\Values\LibraryEntryAnswer;
use App\Values\MenuEntryBuild;
use App\Values\MenuStep;
use App\Values\ScriptGoal;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One proven path through a driver's menus, in its owner's library: the steps that reach the goal from the screen
 * its first step expects, what replaying it completes, the proof that ends it, and the builds it was proven on, each
 * marked stale on its own. It belongs to the user, never to an agent.
 *
 * @property string $id
 * @property string $family
 * @property string $entry_fingerprint
 * @property string $goal_script
 * @property int $goal_version
 * @property array<string, string> $goal_parameters
 * @property string $goal_key
 * @property list<MenuStep> $steps
 * @property NavigationCompletion $completes
 * @property int|null $next_step
 * @property string $proof
 * @property MenuEntryState $state
 * @property list<MenuEntryBuild> $builds
 * @property int $uses
 * @property CarbonImmutable|null $last_used_at
 * @property string|null $last_replay_key
 * @property string $source_request_id
 * @property string|null $superseded_by_id
 */
#[Fillable([
    'source_request_id',
    'family',
    'builds',
    'goal_key',
    'goal_script',
    'goal_version',
    'goal_parameters',
    'completes',
    'proof',
    'entry_fingerprint',
    'steps',
    'next_step',
    'state',
    'superseded_by_id',
    'last_replay_key',
    'last_used_at',
])]
final class MenuEntry extends Model implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['uses' => 0];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'goal_parameters' => 'array',
            'steps' => StoredValuesCast::class.':'.MenuStep::class,
            'completes' => NavigationCompletion::class,
            'state' => MenuEntryState::class,
            'builds' => StoredValuesCast::class.':'.MenuEntryBuild::class,
            'last_used_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The entry a navigation request proved on a build: its steps from the first step's screen to the goal, what
     * they complete and the proof that ends them, current in its owner's library.
     *
     * @param  non-empty-list<MenuStep>  $steps
     */
    public static function create(
        ActorIdentity $owner,
        NavigationRequest $source,
        array $steps,
        NavigationCompletion $completes,
        string $proof,
    ): self {
        $goal = $source->goal;
        $entry = new self();
        $entry->family = $source->family;
        $entry->entry_fingerprint = $steps[0]->fingerprint;
        $entry->goal_script = $goal->script;
        $entry->goal_version = $goal->version;
        $entry->goal_parameters = $goal->sortedParameters();
        $entry->goal_key = $goal->key();
        $entry->steps = $steps;
        $entry->completes = $completes;
        $entry->next_step = $source->next_step;
        $entry->proof = $proof;
        $entry->state = MenuEntryState::Current;
        $entry->builds = [MenuEntryBuild::proven($source->build, CarbonImmutable::now())];
        $entry->source_request_id = $source->id;
        $entry->belongTo($owner);
        $entry->save();

        return $entry;
    }

    // ----------[ Queries ]----------

    /**
     * @param  non-empty-list<MenuStep>  $steps
     */
    public static function lockForPath(NavigationRequest $navigation, array $steps): self|null
    {
        return self::query()->ownedBy($navigation->actor())->current()->forDriver($navigation->family)
            ->matching($steps[0]->fingerprint, $navigation->goal)
            ->whereRaw('steps::jsonb = ?::jsonb', [json_encode(self::storedSteps($steps), JSON_THROW_ON_ERROR)])
            ->lockForUpdate()
            ->recentFirst()
            ->first();
    }

    /**
     * @param  list<string>  $declinedEntries
     */
    public static function replayFor(
        ActorIdentity $owner,
        AgentRuntime $runtime,
        ScriptGoal $goal,
        string $fingerprint,
        array $declinedEntries,
    ): self|null {
        $menuQuery = self::query()->ownedBy($owner)->current()->forDriver($runtime->family)
            ->matching($fingerprint, $goal)->whereNotIn('id', $declinedEntries)->recentFirst();

        $build = $runtime->driver_build;
        $current = (clone $menuQuery)->whereJsonContains('builds', [['build' => $build, 'stale' => false]])->first();

        return $current ?? $menuQuery->whereJsonDoesntContain('builds', [['build' => $build]])->first();
    }

    // ----------[ Mutations ]----------

    /**
     * A replay went by the entry.
     */
    public function used(): void
    {
        $this->uses++;
        $this->last_used_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new MenuEntryUsed($this->id));
    }

    /**
     * A newer proven entry replaces this one.
     */
    public function supersededBy(self $entry): void
    {
        $this->state = MenuEntryState::Superseded;
        $this->superseded_by_id = $entry->id;
        $this->assertSaved($this->save());
        $this->raise(new MenuEntrySuperseded($this->id, $entry->id));
    }

    /**
     * The owner takes the entry out of the library.
     */
    public function retire(): void
    {
        $this->state = MenuEntryState::Retired;
        $this->assertSaved($this->save());
        $this->raise(new MenuEntryRetired($this->id));
    }

    /**
     * The entry's proof on the build, none when it was never proven there.
     */
    public function buildOn(string $build): MenuEntryBuild|null
    {
        return array_find($this->builds, fn (MenuEntryBuild $proven) => $proven->build === $build);
    }

    /**
     * Whether the entry is current but was proven on other builds only, so a replay on this one must prove it again.
     */
    public function wasProvenElsewhere(string $build): bool
    {
        return $this->state->isUsable() && $this->buildOn($build) === null;
    }

    /**
     * A host's replay of the entry worked on the build: the use is counted and the build listed as proven, once for
     * the replay however often the host reports it.
     */
    public function recordReplay(string $operationKey, string $build): void
    {
        if ($this->last_replay_key === $operationKey) {
            return;
        }

        $this->last_replay_key = $operationKey;
        $this->used();
        $this->provenOn($build);
    }

    /**
     * A replay proved the entry on another build too.
     */
    public function provenOn(string $build): void
    {
        $this->storeBuild(MenuEntryBuild::proven($build, CarbonImmutable::now()));
        $this->raise(new MenuEntryProven($this->id, $build));
    }

    /**
     * A replay on the build failed a check: the entry is stale there only, and stays current for the others.
     *
     * @param  list<string>  $screen  the redacted rows it failed on
     */
    public function markStaleOn(string $build, string $reason, array $screen): void
    {
        $proven = $this->buildOn($build) ?? MenuEntryBuild::proven($build, CarbonImmutable::now());

        $this->storeBuild($proven->markedStale($reason, $screen));
        $this->raise(new MenuEntryMarkedStale($this->id, $build));
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ScriptGoal, never>
     */
    protected function goal(): Attribute
    {
        return Attribute::get(
            fn () => new ScriptGoal($this->goal_script, $this->goal_version, $this->goal_parameters),
        )->withoutObjectCaching();
    }

    /**
     * The entry as the host replays it, and nothing else of its owner's.
     *
     * @return Attribute<LibraryEntryAnswer, never>
     */
    protected function libraryAnswer(): Attribute
    {
        return Attribute::get(fn () => new LibraryEntryAnswer(
            $this->id,
            $this->family,
            EntryGoalAnswer::of($this->goal),
            $this->steps,
            $this->completes->value,
            $this->next_step,
            $this->proof,
        ))->withoutObjectCaching();
    }

    // ----------[ Internals ]----------

    /**
     * @param  non-empty-list<MenuStep>  $steps
     * @return non-empty-list<array{fingerprint: string, choose: string|null, key: string|null, proof: string|null}>
     */
    private static function storedSteps(array $steps): array
    {
        return array_map(fn (MenuStep $step) => $step->toArray(), $steps);
    }

    /**
     * Saves the build's proof in place of the entry's earlier proof on that build, or after the others.
     */
    private function storeBuild(MenuEntryBuild $build): void
    {
        $builds = array_column($this->builds, null, 'build');
        $builds[$build->build] = $build;
        $this->builds = array_values($builds);
        $this->save();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function current(Builder $query): void
    {
        $query->where('state', MenuEntryState::Current);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forDriver(Builder $query, string $driver): void
    {
        $query->where('family', $driver);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function matching(Builder $query, string $fingerprint, ScriptGoal $goal): void
    {
        $query->where('entry_fingerprint', $fingerprint)->where('goal_key', $goal->key());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function recentFirst(Builder $query): void
    {
        $query->orderByDesc('updated_at')->orderByDesc('id');
    }
}
