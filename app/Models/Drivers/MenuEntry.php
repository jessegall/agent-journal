<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Navigation\MenuEntryState;
use App\Enums\Navigation\NavigationCompletion;
use App\Events\Sessions\MenuEntryMarkedStale;
use App\Events\Sessions\MenuEntryProven;
use App\Events\Sessions\MenuEntryRetired;
use App\Events\Sessions\MenuEntrySuperseded;
use App\Events\Sessions\MenuEntryUsed;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Values\EntryGoalAnswer;
use App\Values\LibraryEntryAnswer;
use App\Values\MenuEntryBuild;
use App\Values\MenuStep;
use App\Values\ScriptGoal;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $family
 * @property string $entry_fingerprint
 * @property string $goal_script
 * @property int $goal_version
 * @property array $goal_parameters
 * @property string $goal_key
 * @property DataCollection<int, MenuStep> $steps
 * @property NavigationCompletion $completes
 * @property ?int $next_step
 * @property string $proof
 * @property MenuEntryState $state
 * @property DataCollection<int, MenuEntryBuild> $builds
 * @property int $uses
 * @property ?CarbonImmutable $last_used_at
 * @property ?string $last_replay_key
 * @property string $source_request_id
 * @property ?string $superseded_by_id
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $goal attribute
 * @property mixed $library_answer attribute
 */
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
     *
     * @column goal_parameters array<string,string>
     */
    protected function casts(): array
    {
        return [
            'goal_parameters' => 'array',
            'steps' => DataCollection::class.':'.MenuStep::class,
            'completes' => NavigationCompletion::class,
            'state' => MenuEntryState::class,
            'builds' => DataCollection::class.':'.MenuEntryBuild::class,
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
        $entry->steps = MenuStep::collect($steps, DataCollection::class);
        $entry->completes = $completes;
        $entry->next_step = $source->next_step;
        $entry->proof = $proof;
        $entry->state = MenuEntryState::Current;
        $build = MenuEntryBuild::proven($source->build, CarbonImmutable::now());
        $entry->builds = MenuEntryBuild::collect([$build], DataCollection::class);
        $entry->source_request_id = $source->id;
        $entry->belongTo($owner);
        $entry->save();

        return $entry;
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
        return array_find($this->builds->items(), fn (MenuEntryBuild $proven) => $proven->build === $build);
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
        return Accessor::get(fn () => new ScriptGoal($this->goal_script, $this->goal_version, $this->goal_parameters));
    }

    /**
     * The entry as the host replays it, and nothing else of its owner's.
     *
     * @return Attribute<LibraryEntryAnswer, never>
     */
    protected function libraryAnswer(): Attribute
    {
        return Accessor::get(fn () => new LibraryEntryAnswer(
            $this->id,
            $this->family,
            EntryGoalAnswer::of($this->goal),
            $this->steps->items(),
            $this->completes->value,
            $this->next_step,
            $this->proof,
        ));
    }

    // ----------[ Internals ]----------

    /**
     * Saves the build's proof in place of the entry's earlier proof on that build, or after the others.
     */
    private function storeBuild(MenuEntryBuild $build): void
    {
        $builds = array_column($this->builds->items(), null, 'build');
        $builds[$build->build] = $build;
        $this->builds = MenuEntryBuild::collect(array_values($builds), DataCollection::class);
        $this->save();
    }

    // ----------[ Queries ]----------

    /**
     * @param  non-empty-list<MenuStep>  $steps
     */
    public static function lockForPath(NavigationRequest $navigation, array $steps): self|null
    {
        return self::query()->ownedBy($navigation->actor())->current()->forDriver($navigation->family)
            ->matching($steps[0]->fingerprint, $navigation->goal)
            ->withSteps($steps)
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
            ->matching($fingerprint, $goal)->whereKeyNot($declinedEntries)->recentFirst();

        $build = $runtime->driver_build;
        $current = (clone $menuQuery)->currentOnBuild($build)->first();

        return $current ?? $menuQuery->unseenOnBuild($build)->first();
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

    /**
     * The entries whose stored steps are exactly these.
     *
     * @param  Builder<self>  $query
     * @param  non-empty-list<MenuStep>  $steps
     */
    #[Scope]
    protected function withSteps(Builder $query, array $steps): void
    {
        $stored = MenuStep::collect($steps, DataCollection::class);

        $query->whereRaw('steps::jsonb = ?::jsonb', [$stored->toJson()]);
    }

    /**
     * The entries that still work on the build.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function currentOnBuild(Builder $query, string $build): void
    {
        $query->whereJsonContains('builds', [[
            'build' => $build,
            'is_stale' => false,
        ]]);
    }

    /**
     * The entries never tried on the build.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unseenOnBuild(Builder $query, string $build): void
    {
        $query->whereJsonDoesntContain('builds', [['build' => $build]]);
    }
}
