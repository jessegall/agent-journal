<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Models;

use App\Core\Hooks\Support\StackTarget;
use App\Core\Links\Support\Linkable;
use App\Domain\Tasks\Enums\TaskState;
use App\Domain\Tasks\Enums\TaskWorkState;
use App\Domain\Tasks\Support\TaskWork;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One task. Each start begins a run; the agent and session working on it are set only by starting it.
 * Every agent reads every task, so it has no agent limit.
 *
 * @property int $id
 * @property string $title
 * @property TaskState $state
 * @property int $run_number
 * @property int|null $agent_id
 * @property int|null $session_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title'])]
final class Task extends Model
{
    use Linkable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'open', 'run_number' => 0];

    /**
     * Starts a new run for the target; a task that is already started keeps its run.
     */
    public function startFor(StackTarget $target): void
    {
        if ($this->state !== TaskState::Started) {
            $this->run_number++;
        }

        $this->state = TaskState::Started;
        $this->agent_id = $target->agentId;
        $this->session_id = $target->sessionId;
        $this->save();
    }

    public function finish(): void
    {
        $this->state = TaskState::Finished;
        $this->save();
    }

    public function block(): void
    {
        $this->state = TaskState::Blocked;
        $this->save();
    }

    public function cancel(): void
    {
        $this->state = TaskState::Cancelled;
        $this->save();
    }

    /**
     * What the stack sees of one run: the current run follows the task's state, an earlier run is over.
     */
    public function workFor(int $runNumber): TaskWork
    {
        if ($runNumber !== $this->run_number) {
            return new TaskWork($this->id, $runNumber, TaskWorkState::Finished);
        }

        return new TaskWork($this->id, $runNumber, $this->state->workState());
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => TaskState::class,
            'run_number' => 'integer',
            'agent_id' => 'integer',
            'session_id' => 'integer',
        ];
    }
}
