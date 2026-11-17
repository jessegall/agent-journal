<?php

declare(strict_types=1);

namespace App\Domain\Sequences\Models;

use App\Domain\Hooks\Storage\StackTarget;
use App\Domain\Links\Linkable;
use App\Domain\Sequences\SequenceRunState;
use App\Domain\Sequences\SequenceWork;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One run of a sequence: its steps, the step it is on and whether it still runs. The agent and session following it are set by starting it.
 *
 * @property int $id
 * @property string $name
 * @property list<string> $steps
 * @property int $current_step
 * @property SequenceRunState $state
 * @property int|null $agent_id
 * @property int|null $session_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'steps'])]
final class SequenceRun extends Model
{
    use Linkable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['current_step' => 1, 'state' => 'running'];

    public function startFor(StackTarget $target): void
    {
        $this->current_step = 1;
        $this->state = SequenceRunState::Running;
        $this->agent_id = $target->agentId;
        $this->session_id = $target->sessionId;
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
        return new SequenceWork($this->id, $this->current_step, $this->steps[$this->current_step - 1], $this->state);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'steps' => 'array',
            'current_step' => 'integer',
            'state' => SequenceRunState::class,
            'agent_id' => 'integer',
            'session_id' => 'integer',
        ];
    }
}
