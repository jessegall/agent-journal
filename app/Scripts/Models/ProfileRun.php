<?php

declare(strict_types=1);

namespace App\Scripts\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Scripts\Enums\ProfileRunState;
use App\Scripts\Exceptions\ProfileRunRefused;
use App\Scripts\Values\StepOutcome;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * One run of a profile's activated script for an actor's work, started by one trigger: the revision and digest it
 * runs, the line its cursor stands on, the step it waits on while suspended, the workspace generation it started on,
 * how many returns in a row found that generation unchanged, what it told the actor when it ended, and its place
 * among the actor's runs on that work.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $work
 * @property string $profile_key
 * @property int $profile_revision
 * @property string $definition_digest
 * @property string $trigger_reference
 * @property ProfileRunState $state
 * @property int $cursor
 * @property string|null $awaited_step
 * @property int|null $generation
 * @property int $unchanged_returns
 * @property string|null $message
 * @property int $sequence
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('profile_runs')]
#[Fillable([
    'work',
    'profile_key',
    'profile_revision',
    'definition_digest',
    'trigger_reference',
    'state',
    'cursor',
    'awaited_step',
    'generation',
    'unchanged_returns',
    'message',
    'sequence',
])]
final class ProfileRun extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'profile_revision' => 'integer',
            'cursor' => 'integer',
            'generation' => 'integer',
            'unchanged_returns' => 'integer',
            'sequence' => 'integer',
            'state' => ProfileRunState::class,
        ];
    }

    /**
     * The run a trigger is answered by: the run it started, else the actor's unfinished run on this work, which
     * the new trigger continues (there is never more than one), else a new run, numbered after the others.
     */
    public static function forTrigger(
        ActorIdentity $actor,
        WorkReference $work,
        string $profileKey,
        int $profileRevision,
        string $definitionDigest,
        string $triggerReference,
    ): self {
        $runs = self::query()->acrossActors()->ownedBy($actor)->where('work', $work->key);
        $run = (clone $runs)->where('trigger_reference', $triggerReference)->first()
            ?? (clone $runs)->whereIn('state', ProfileRunState::unfinished())->first();

        if ($run !== null) {
            return $run;
        }

        $run = new self();
        $run->work = $work->key;
        $run->profile_key = $profileKey;
        $run->profile_revision = $profileRevision;
        $run->definition_digest = $definitionDigest;
        $run->trigger_reference = $triggerReference;
        $run->state = ProfileRunState::Running;
        $run->unchanged_returns = 0;
        $run->sequence = (int) (clone $runs)->max('sequence') + 1;
        $run->belongTo($actor);
        $run->save();

        return $run;
    }

    public static function lockedForStep(string $runId): self
    {
        return self::query()->acrossActors()->whereKey($runId)->lockForUpdate()->firstOrFail();
    }

    /**
     * The actor's last run on this work that ended before this one began.
     *
     * @return Option<self>
     */
    public function previous(): Option
    {
        return Option::fromValue(self::query()->acrossActors()
            ->where('actor_type', $this->actor_type)
            ->where('actor_id', $this->actor_id)
            ->where('work', $this->work)
            ->where('sequence', '<', $this->sequence)
            ->whereNotIn('state', ProfileRunState::unfinished())
            ->orderByDesc('sequence')
            ->first());
    }

    /**
     * Records the workspace generation the run starts on.
     */
    public function startOn(int $generation): void
    {
        $this->generation = $generation;
        $this->save();
    }

    /**
     * Suspends the run on a line until the step it waits on has its outcome.
     */
    public function suspendOn(int $line, string $stepReference): void
    {
        $this->cursor = $line;
        $this->state = ProfileRunState::Suspended;
        $this->awaited_step = $stepReference;
        $this->save();
    }

    /**
     * Records the host's outcome of the step the run waits on, once, and resumes the same instruction; a step it
     * does not wait on is refused, and the outcome of a step already recorded is kept as it was.
     *
     * @throws ProfileRunRefused
     */
    public function recordStep(string $stepReference, StepOutcome $outcome): ProfileStepResult
    {
        $recorded = $this->results()->where('step_reference', $stepReference)->first();

        if ($recorded !== null) {
            return $recorded;
        }

        if ($this->state !== ProfileRunState::Suspended || $this->awaited_step !== $stepReference) {
            throw ProfileRunRefused::stepNotAwaited($this->id, $stepReference);
        }

        $result = ProfileStepResult::record($this, $stepReference, $outcome);
        $this->state = ProfileRunState::Running;
        $this->awaited_step = null;
        $this->save();

        return $result;
    }

    /**
     * Records the outcome of a step the run took itself, once: a step replayed from its record is not recorded again.
     */
    public function completeStep(string $stepReference, StepOutcome $outcome): void
    {
        if ($this->results()->where('step_reference', $stepReference)->exists()) {
            return;
        }

        ProfileStepResult::record($this, $stepReference, $outcome);
    }

    /**
     * Ends the run in a finished state with what it told the actor and how many unchanged returns led to it.
     */
    public function finish(ProfileRunState $state, string $message, int $unchangedReturns): void
    {
        $this->state = $state;
        $this->message = $message;
        $this->unchanged_returns = $unchangedReturns;
        $this->awaited_step = null;
        $this->save();
    }

    /**
     * The outcome recorded for one of the run's steps.
     *
     * @return Option<StepOutcome>
     */
    public function outcomeOf(string $stepReference): Option
    {
        $result = $this->results()->where('step_reference', $stepReference)->first();

        return $result === null ? None::create() : new Some($result->outcome());
    }

    /**
     * The actor whose stop the run prepares.
     */
    public function actor(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id);
    }

    /**
     * @return HasMany<ProfileStepResult, $this>
     */
    public function results(): HasMany
    {
        return $this->hasMany(ProfileStepResult::class);
    }
}
