<?php

declare(strict_types=1);

namespace Domain\Sequences\Models;

use App\Actors\Exceptions\CrossOwnerReadRefused;
use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\AuthoredModel;
use App\Records\Contracts\Numbered;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Events\SequenceStepEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string|null $sequence_id
 * @property string $name
 * @property list<string> $steps
 * @property int $current_step
 * @property SequenceRunStatus $status
 * @property string|null $actor_type
 * @property string|null $actor_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Sequence|null $sequence
 *
 * @mixin \Eloquent
 */
final class SequenceRun extends JournalModel implements AuthoredModel, EventSource, Numbered, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasNumber;
    use Linkable;
    use RaisesEvents;

    /**
     * The most actors the runs list offers to choose from.
     */
    public const int FOLLOWER_LIMIT = 200;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'current_step' => 1,
        'status' => 'running',
    ];

    /**
     * @return array<string, string>
     *
     * @column steps list<string>
     */
    protected function casts(): array
    {
        return [
            'steps' => 'array',
            'current_step' => 'integer',
            'status' => SequenceRunStatus::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The actor the run was started for, or the system actor for a run nobody follows.
     */
    public function author(): ActorReference
    {
        if ($this->actor_type === null || $this->actor_id === null) {
            return ActorReference::system();
        }

        return ActorReference::fromStored($this->actor_type, $this->actor_id);
    }

    /**
     * The runs this actor follows, within a read already across owners.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function followedBy(Builder $query, ActorReference $actor): void
    {
        $query->where($query->qualifyColumn('actor_type'), $actor->type)
            ->where($query->qualifyColumn('actor_id'), $actor->id);
    }

    /**
     * A run of the named steps, not started yet.
     *
     * @param  list<string>  $steps
     */
    public static function create(string $name, array $steps): self
    {
        $run = new self();
        $run->name = $name;
        $run->steps = $steps;
        $run->save();

        return $run;
    }

    // ----------[ Mutations ]----------

    /**
     * The sequence starts at its first step, followed by the actor given in the session given.
     */
    public function startFor(ActorReference $follower, string $sessionId): void
    {
        $this->current_step = 1;
        $this->status = SequenceRunStatus::Running;
        $this->belongTo($follower);
        $this->saveAndAssert();
        $this->raise(new SequenceStarted($this->id, new StackTarget($follower->id, $sessionId)));
        $this->raise(new SequenceStepReached($this->id, $this->owningActor(), $this->current_step));
    }

    /**
     * Moves to the next step, and finishes the run after its last step.
     */
    public function advance(): void
    {
        $ended = $this->current_step;

        if ($ended >= count($this->steps)) {
            $this->status = SequenceRunStatus::Finished;
            $this->saveAndAssert();
            $this->raise(new SequenceStepEnded($this->id, $this->owningActor(), $ended));
            $this->raise(new SequenceEnded($this->id, $this->owningActor(), $this->status));

            return;
        }

        $this->current_step++;
        $this->saveAndAssert();
        $this->raise(new SequenceStepEnded($this->id, $this->owningActor(), $ended));
        $this->raise(new SequenceStepReached($this->id, $this->owningActor(), $this->current_step));
    }

    /**
     * The sequence run is cancelled before its last step.
     */
    public function cancel(): void
    {
        $this->status = SequenceRunStatus::Cancelled;
        $this->saveAndAssert();
        $this->raise(new SequenceEnded($this->id, $this->owningActor(), $this->status));
    }

    /**
     * What the chat says of a step the run came to: the step's place among them and its words.
     */
    public function stepLine(int $step): string
    {
        return "step {$step} of ".count($this->steps).' · '.$this->steps[$step - 1];
    }

    // ----------[ Queries ]----------

    /**
     * The actors that follow runs, each once, for a caller that may read every owner's runs.
     *
     * @return list<ActorReference>
     *
     * @throws CrossOwnerReadRefused
     */
    public static function resolveFollowers(): array
    {
        $runs = self::query()
            ->acrossOwners()
            ->onePerFollower()
            ->readUpTo(self::FOLLOWER_LIMIT)
            ->get();

        return array_values($runs->map(fn (self $run) => $run->owningActor())->all());
    }

    /**
     * @return BelongsTo<Sequence, $this>
     */
    public function sequence(): BelongsTo
    {
        return $this->belongsTo(Sequence::class);
    }

    /**
     * The run read under its row lock, among those the actor may see, for a change that must happen once.
     */
    public static function findLockedById(string $id): self
    {
        // A run belongs to no actor until it is started, so its start may also take a run nobody follows yet.
        return self::lockedForActorOrUnheld($id, SequenceRunMissing::throwing()->forId($id));
    }

    // ----------[ Scopes ]----------

    /**
     * One row for each actor that follows a run, holding only who the actor is.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onePerFollower(Builder $query): void
    {
        $query->whereNotNull('actor_id')->select(['actor_type', 'actor_id'])->groupBy('actor_type', 'actor_id');
    }
}
