<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\MenuEntryState;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Values\MenuBuild;
use App\Agents\Values\MenuStep;
use App\Agents\Values\ScriptGoal;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One proven path through a program's menus, in its owner's library: the steps that reach the goal from the screen
 * its first step expects, what replaying it completes, the proof that ends it, and the builds it was proven on, each
 * marked stale on its own (doc 54, sections 4 and 15). It belongs to the user, never to an agent.
 *
 * @property string $id
 * @property string $program
 * @property string $entry_fingerprint
 * @property string $goal_script
 * @property int $goal_version
 * @property array<string, string> $goal_parameters
 * @property string $goal_key
 * @property list<array<string, string|null>> $steps
 * @property NavigationCompletion $completes
 * @property int|null $next_step
 * @property string $proof
 * @property MenuEntryState $state
 * @property list<array<string, mixed>> $builds
 * @property int $uses
 * @property CarbonImmutable|null $last_used_at
 * @property string $source_request_id
 * @property string|null $superseded_by_id
 */
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
    public static function proven(
        ActorIdentity $owner,
        NavigationRequest $source,
        array $steps,
        NavigationCompletion $completes,
        string $proof,
    ): self {
        $goal = $source->goal();
        $entry = new self();
        $entry->program = $source->program;
        $entry->entry_fingerprint = $steps[0]->fingerprint;
        $entry->goal_script = $goal->script;
        $entry->goal_version = $goal->version;
        $entry->goal_parameters = $goal->sortedParameters();
        $entry->goal_key = $goal->key();
        $entry->steps = array_map(fn (MenuStep $step) => $step->toArray(), $steps);
        $entry->completes = $completes;
        $entry->next_step = $source->next_step;
        $entry->proof = $proof;
        $entry->state = MenuEntryState::Current;
        $entry->builds = [MenuBuild::proven($source->build, CarbonImmutable::now())->toArray()];
        $entry->source_request_id = $source->id;
        $entry->belongTo($owner);
        $entry->save();

        return $entry;
    }

    public function goal(): ScriptGoal
    {
        return new ScriptGoal($this->goal_script, $this->goal_version, $this->goal_parameters);
    }

    /**
     * @return list<MenuStep>
     */
    public function steps(): array
    {
        return array_map(fn (array $step) => MenuStep::from($step), $this->steps);
    }

    /**
     * The builds the entry was proven on, by build.
     *
     * @return array<string, MenuBuild>
     */
    public function builds(): array
    {
        $builds = [];
        foreach ($this->builds as $stored) {
            $build = MenuBuild::from($stored);
            $builds[$build->build] = $build;
        }

        return $builds;
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
     * A replay went by the entry.
     */
    public function used(): void
    {
        $this->uses++;
        $this->last_used_at = CarbonImmutable::now();
        $this->save();
    }

    /**
     * A replay proved the entry on another build too.
     */
    public function provenOn(string $build): void
    {
        $builds = $this->builds();
        $builds[$build] = MenuBuild::proven($build, CarbonImmutable::now());
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
        $builds[$build] = ($builds[$build] ?? MenuBuild::proven($build, CarbonImmutable::now()))
            ->markedStale($reason, $screen);
        $this->storeBuilds($builds);
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
    protected function forProgram(Builder $query, string $program): void
    {
        $query->where('program', $program);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function matching(Builder $query, string $entryFingerprint, ScriptGoal $goal): void
    {
        $query->where('entry_fingerprint', $entryFingerprint)->where('goal_key', $goal->key());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function recentFirst(Builder $query): void
    {
        $query->orderByDesc('updated_at');
    }

    /**
     * @param  array<string, MenuBuild>  $builds
     */
    private function storeBuilds(array $builds): void
    {
        $this->builds = array_values(array_map(fn (MenuBuild $build) => $build->toArray(), $builds));
        $this->save();
    }
}
