<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\MenuEntryState;
use App\Enums\NavigationCompletion;
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
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One proven path through a driver's menus, in its owner's library: the steps that reach the goal from the screen
 * its first step expects, what replaying it completes, the proof that ends it, and the builds it was proven on, each
 * marked stale on its own (doc 54, sections 4 and 15). It belongs to the user, never to an agent.
 *
 * @property string $id
 * @property string $family
 * @property string $entry_fingerprint
 * @property string $goal_script
 * @property int $goal_version
 * @property array<string, string> $goal_parameters
 * @property string $goal_key
 * @property list<array{fingerprint: string, choose: string|null, key: string|null, proof: string|null}> $steps
 * @property NavigationCompletion $completes
 * @property int|null $next_step
 * @property string $proof
 * @property MenuEntryState $state
 * @property list<array<string, mixed>> $builds
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
final class MenuEntry extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['uses' => 0];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'goal_parameters' => 'array',
            'steps' => 'array',
            'completes' => NavigationCompletion::class,
            'state' => MenuEntryState::class,
            'builds' => 'array',
            'last_used_at' => 'immutable_datetime',
        ];
    }

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
        $goal = $source->goal();
        $entry = new self();
        $entry->family = $source->family;
        $entry->entry_fingerprint = $steps[0]->fingerprint;
        $entry->goal_script = $goal->script;
        $entry->goal_version = $goal->version;
        $entry->goal_parameters = $goal->sortedParameters();
        $entry->goal_key = $goal->key();
        $entry->steps = self::storedSteps($steps);
        $entry->completes = $completes;
        $entry->next_step = $source->next_step;
        $entry->proof = $proof;
        $entry->state = MenuEntryState::Current;
        $entry->builds = [MenuEntryBuild::proven($source->build, CarbonImmutable::now())->toArray()];
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
            ->matching($steps[0]->fingerprint, $navigation->goal())
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
        $this->save();
    }

    /**
     * A newer proven entry replaces this one.
     */
    public function supersededBy(self $entry): void
    {
        $this->state = MenuEntryState::Superseded;
        $this->superseded_by_id = $entry->id;
        $this->save();
    }

    /**
     * The owner takes the entry out of the library.
     */
    public function retire(): void
    {
        $this->state = MenuEntryState::Retired;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function goal(): ScriptGoal
    {
        return new ScriptGoal($this->goal_script, $this->goal_version, $this->goal_parameters);
    }

    /**
     * @return list<MenuStep>
     */
    public function steps(): array
    {
        return array_map(fn (array $step) => MenuStep::fromStored($step), $this->steps);
    }

    /**
     * The builds the entry was proven on, by build.
     *
     * @return array<string, MenuEntryBuild>
     */
    public function builds(): array
    {
        return array_column(MenuEntryBuild::collect($this->builds), null, 'build');
    }

    /**
     * Whether a replay on the build may go by the entry: it is current and proven there, and not stale there.
     */
    public function isCurrentOn(string $build): bool
    {
        $proven = $this->builds()[$build] ?? null;

        return $this->state->isUsable() && $proven !== null && ! $proven->stale;
    }

    /**
     * Whether the entry is current but was proven on other builds only, so a replay on this one must prove it again.
     */
    public function wasProvenElsewhere(string $build): bool
    {
        return $this->state->isUsable() && ! array_key_exists($build, $this->builds());
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
        $builds = $this->builds();
        $builds[$build] = MenuEntryBuild::proven($build, CarbonImmutable::now());
        $this->storeBuilds($builds);
    }

    /**
     * A replay on the build failed a check: the entry is stale there only, and stays current for the others.
     *
     * @param  list<string>  $screen  the redacted rows it failed on
     */
    public function markStaleOn(string $build, string $reason, array $screen): void
    {
        $builds = $this->builds();

        $builds[$build] = ($builds[$build] ?? MenuEntryBuild::proven($build, CarbonImmutable::now()))
            ->markedStale($reason, $screen);

        $this->storeBuilds($builds);
    }

    /**
     * The entry as the host replays it, and nothing else of its owner's.
     */
    public function libraryAnswer(): LibraryEntryAnswer
    {
        return new LibraryEntryAnswer(
            $this->id,
            $this->family,
            EntryGoalAnswer::of($this->goal()),
            $this->steps(),
            $this->completes->value,
            $this->next_step,
            $this->proof,
        );
    }

    // ----------[ Internals ]----------

    /**
     * @param  non-empty-list<MenuStep>  $steps
     * @return non-empty-list<array{fingerprint: string, choose: string|null, key: string|null, proof: string|null}>
     */
    private static function storedSteps(array $steps): array
    {
        return array_map(fn (MenuStep $step) => $step->toStored(), $steps);
    }

    /**
     * @param  array<string, MenuEntryBuild>  $builds
     */
    private function storeBuilds(array $builds): void
    {
        $this->builds = array_values(array_map(fn (MenuEntryBuild $build) => $build->toArray(), $builds));
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
