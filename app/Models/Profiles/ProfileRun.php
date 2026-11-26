<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Profiles\ProfileRunStatus;
use App\Events\Accounts\ProfileRunFinished;
use App\Events\Accounts\ProfileRunResumed;
use App\Events\Accounts\ProfileRunStarted;
use App\Events\Accounts\ProfileRunSuspended;
use App\Exceptions\ProfileRunRefused;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\HasActorColumns;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Values\StepOutcome;
use App\Values\WorkReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $work
 * @property string $profile_key
 * @property int $profile_revision
 * @property string $definition_digest
 * @property string $trigger_reference
 * @property ProfileRunStatus $status
 * @property int $cursor
 * @property string|null $awaited_step
 * @property int|null $generation
 * @property int $unchanged_returns
 * @property string|null $message
 * @property int $sequence
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, ProfileStepResult> $results
 * @property-read int|null $results_count
 *
 * @mixin \Eloquent
 */
#[Table('profile_runs')]
final class ProfileRun extends JournalModel implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasActorColumns;
    use Linkable;
    use RaisesEvents;

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
            'status' => ProfileRunStatus::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The run a trigger is answered by: the run it started, else the actor's unfinished run on this work, which
     * the new trigger continues (there is never more than one), else a new run, numbered after the others.
     */
    public static function create(
        ActorReference $actor,
        WorkReference $work,
        string $profileKey,
        int $revision,
        string $definitionDigest,
        string $reference,
    ): self {
        $runs = self::query()->acrossActors()->ownedBy($actor)->aboutWork($work->key);

        $run = (clone $runs)->underTrigger($reference)->first() ?? (clone $runs)->unfinished()->first();

        if ($run !== null) {
            return $run;
        }

        $run = new self();
        $run->work = $work->key;
        $run->profile_key = $profileKey;
        $run->profile_revision = $revision;
        $run->definition_digest = $definitionDigest;
        $run->trigger_reference = $reference;
        $run->status = ProfileRunStatus::Running;
        $run->unchanged_returns = 0;
        $run->sequence = (int) (clone $runs)->max('sequence') + 1;
        $run->belongTo($actor);
        $run->save();

        return $run;
    }

    // ----------[ Mutations ]----------

    /**
     * Records the workspace generation the run starts on.
     */
    public function startOn(int $generation): void
    {
        $this->generation = $generation;
        $this->assertSaved($this->save());
        $this->raise(new ProfileRunStarted($this->id, $generation));
    }

    /**
     * Suspends the run on a line until the step it waits on has its outcome.
     */
    public function suspendOn(int $line, string $stepReference): void
    {
        $this->cursor = $line;
        $this->status = ProfileRunStatus::Suspended;
        $this->awaited_step = $stepReference;
        $this->assertSaved($this->save());
        $this->raise(new ProfileRunSuspended($this->id, $line));
    }

    /**
     * The step the run waited for is reported: the run goes on.
     *
     * @throws ProfileRunRefused when the run does not wait for this step
     */
    public function resumeAfter(string $reference): void
    {
        $this->assertAwaiting($reference);

        $this->status = ProfileRunStatus::Running;
        $this->awaited_step = null;
        $this->assertSaved($this->save());
        $this->raise(new ProfileRunResumed($this->id));
    }

    /**
     * Ends the run in a finished state with what it told the actor and how many unchanged returns led to it.
     */
    public function finish(ProfileRunStatus $state, string $message, int $unchangedReturns): void
    {
        $this->status = $state;
        $this->message = $message;
        $this->unchanged_returns = $unchangedReturns;
        $this->awaited_step = null;
        $this->assertSaved($this->save());
        $this->raise(new ProfileRunFinished($this->id, $state));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the actor's last run on this work before this one ended held, so the owner was told already.
     */
    public function followsHeldRun(): bool
    {
        return $this->previous()
            ->filter(fn (self $previous) => $previous->status === ProfileRunStatus::Held)
            ->isDefined();
    }

    /**
     * Whether the step's result is already recorded, so a repeated report records nothing.
     */
    public function hasRecordedStep(string $reference): bool
    {
        return $this->results()->forStep($reference)->exists();
    }

    // ----------[ Transformers ]----------

    /**
     * The actor's last run on this work that ended before this one began.
     *
     * @return Option<self>
     */
    public function previous(): Option
    {
        $profileRun = self::query()->acrossActors()
            ->ofSameRunnerAndWorkAs($this)
            ->earlierInSequenceThan($this->sequence)
            ->finished()
            ->newestSequenceFirst()
            ->first();

        return Option::fromValue($profileRun);
    }

    /**
     * The outcome recorded for one of the run's steps.
     *
     * @return Option<StepOutcome>
     */
    public function outcomeOf(string $stepReference): Option
    {
        $result = $this->recordedResult($stepReference);

        if ($result === null) {
            return None::create();
        }

        return new Some($result->outcome);
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<ProfileStepResult, $this>
     */
    public function results(): HasMany
    {
        return $this->hasMany(ProfileStepResult::class);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a resume of a run that is not suspended on that step.
     *
     * @throws ProfileRunRefused
     */
    private function assertAwaiting(string $reference): void
    {
        if ($this->status !== ProfileRunStatus::Suspended || $this->awaited_step !== $reference) {
            throw ProfileRunRefused::stepNotAwaited($this->id, $reference);
        }
    }

    // ----------[ Internals ]----------

    private function recordedResult(string $reference): ProfileStepResult|null
    {
        return $this->results()->forStep($reference)->first();
    }

    // ----------[ Queries ]----------

    public static function findLockedForStep(string $runId): self
    {
        return self::query()->acrossActors()->whereKey($runId)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Scopes ]----------

    /**
     * The runs about the work.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function aboutWork(Builder $query, string $work): void
    {
        $query->where('work', $work);
    }

    /**
     * The run its trigger started under that reference.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function underTrigger(Builder $query, string $reference): void
    {
        $query->where('trigger_reference', $reference);
    }

    /**
     * The runs still going.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unfinished(Builder $query): void
    {
        $query->whereIn('status', ProfileRunStatus::unfinished());
    }

    /**
     * The runs that ended.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function finished(Builder $query): void
    {
        $query->whereNotIn('status', ProfileRunStatus::unfinished());
    }

    /**
     * The runs of the run's actor about the run's work.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSameRunnerAndWorkAs(Builder $query, self $run): void
    {
        $query->where('actor_type', $run->actor_type)
            ->where('actor_id', $run->actor_id)
            ->where('work', $run->work);
    }

    /**
     * The runs before that sequence number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function earlierInSequenceThan(Builder $query, int $sequence): void
    {
        $query->where('sequence', '<', $sequence);
    }

    /**
     * The runs newest sequence number first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestSequenceFirst(Builder $query): void
    {
        $query->orderByDesc('sequence');
    }

    /**
     * The rows with their results loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withResults(Builder $query): void
    {
        $query->with('results');
    }
}
