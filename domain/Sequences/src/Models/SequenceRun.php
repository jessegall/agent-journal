<?php

declare(strict_types=1);

namespace Domain\Sequences\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\Numbered;
use App\Contracts\ReadableModel;
use App\Enums\ActorType;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Values\StackTarget;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Events\SequenceStepEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Support\SequenceWork;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One run of a sequence: its steps, the step it is on and whether it still runs. The agent and session following it are
 * set by starting it.
 * Only the agent following it reads it.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $name
 * @property list<string> $steps
 * @property int $current_step
 * @property SequenceRunState $state
 * @property string|null $actor_type
 * @property string|null $actor_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'steps'])]
final class SequenceRun extends Model implements EventSource, Numbered, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['current_step' => 1, 'state' => 'running'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'steps' => 'array',
            'current_step' => 'integer',
            'state' => SequenceRunState::class,
        ];
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

    // ----------[ Queries ]----------

    /**
     * The run read under its row lock, among those the actor may see, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        // A run belongs to no actor until it is started, so its start may also take a run nobody follows yet.
        return self::lockedForActorOrUnheld($id) ?? throw SequenceRunMissing::forId($id);
    }

    // ----------[ Mutations ]----------

    public function startFor(ActorIdentity $follower, string $sessionId): void
    {
        $this->current_step = 1;
        $this->state = SequenceRunState::Running;
        $this->belongTo($follower);
        $this->assertSaved($this->save());
        $this->raise(new SequenceStarted($this->id, new StackTarget($follower->id, $sessionId)));
        $this->raise(new SequenceStepReached($this->id, $this->follower(), $this->current_step));
    }

    /**
     * Moves to the next step, and finishes the run after its last step.
     */
    public function advance(): void
    {
        $ended = $this->current_step;

        if ($ended >= count($this->steps)) {
            $this->state = SequenceRunState::Finished;
            $this->assertSaved($this->save());
            $this->raise(new SequenceStepEnded($this->id, $this->follower(), $ended));
            $this->raise(new SequenceEnded($this->id, $this->follower(), $this->state));

            return;
        }

        $this->current_step++;
        $this->assertSaved($this->save());
        $this->raise(new SequenceStepEnded($this->id, $this->follower(), $ended));
        $this->raise(new SequenceStepReached($this->id, $this->follower(), $this->current_step));
    }

    public function cancel(): void
    {
        $this->state = SequenceRunState::Cancelled;
        $this->assertSaved($this->save());
        $this->raise(new SequenceEnded($this->id, $this->follower(), $this->state));
    }

    /**
     * The agent following the run, set by starting it.
     */
    public function follower(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from((string) $this->actor_type), (string) $this->actor_id);
    }

    /**
     * What the chat says of a step the run came to: the step's place among them and its words.
     */
    public function stepLine(int $step): string
    {
        return "step {$step} of ".count($this->steps).' · '.$this->steps[$step - 1];
    }

    // ----------[ Answers ]----------

    public function work(): SequenceWork
    {
        return new SequenceWork(
            $this->number,
            $this->current_step,
            $this->steps[$this->current_step - 1],
            $this->state,
        );
    }
}
