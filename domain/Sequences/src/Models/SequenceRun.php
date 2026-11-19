<?php

declare(strict_types=1);

namespace Domain\Sequences\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Support\SequenceWork;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One run of a sequence: its steps, the step it is on and whether it still runs. The agent and session following it are set by starting it.
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
final class SequenceRun extends Model implements Numbered, ReadableModel
{
    use BelongsToOneActor, HasNumber, HasUlids;
    use BoundedReads;
    use Linkable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['current_step' => 1, 'state' => 'running'];

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
    public static function written(string $name, array $steps): self
    {
        $run = new self();
        $run->name = $name;
        $run->steps = $steps;
        $run->save();

        return $run;
    }

    /**
     * The run read under its row lock, among those the actor may see, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        // A run belongs to no actor until it is started, so its start may also take a run nobody follows yet.
        return self::lockedForActorOrUnheld($id) ?? throw SequenceRunMissing::forId($id);
    }

    public function startFor(ActorIdentity $follower): void
    {
        $this->current_step = 1;
        $this->state = SequenceRunState::Running;
        $this->belongTo($follower);
        $this->save();
    }

    /**
     * Moves to the next step, and finishes the run after its last step.
     */
    public function advance(): void
    {
        if ($this->current_step >= count($this->steps)) {
            $this->state = SequenceRunState::Finished;
            $this->save();

            return;
        }

        $this->current_step++;
        $this->save();
    }

    public function cancel(): void
    {
        $this->state = SequenceRunState::Cancelled;
        $this->save();
    }

    public function work(): SequenceWork
    {
        return new SequenceWork($this->number, $this->current_step, $this->steps[$this->current_step - 1], $this->state);
    }
}
