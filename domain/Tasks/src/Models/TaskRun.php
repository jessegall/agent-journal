<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\Assignable;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use Domain\Tasks\Enums\TaskRunState;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * One numbered run of a task: who started it, whether it is still worked on and how it ended. Who works on it now is
 * the holder of its Core claim, never a column here.
 *
 * @property string $id
 * @property string $task_id
 * @property int $run_number
 * @property string $started_by_type
 * @property string $started_by_id
 * @property TaskRunState $state
 * @property string|null $outcome
 * @property string|null $reply_inbox_id
 */
#[Table('task_runs')]
#[Fillable(['task_id', 'run_number', 'started_by_type', 'started_by_id', 'state', 'outcome', 'reply_inbox_id'])]
final class TaskRun extends Model implements Assignable, ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'tasks.run';

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return ['run_number' => 'integer', 'state' => TaskRunState::class];
    }

    /**
     * A new run started by the starter, answering to the inbox the starter replies at, fixed from now on.
     *
     * @param  Option<string>  $replyInboxId
     */
    public static function startFor(Task $task, int $runNumber, ActorIdentity $starter, Option $replyInboxId): self
    {
        $run = new self([
            'task_id' => $task->id,
            'run_number' => $runNumber,
            'started_by_type' => $starter->type->value,
            'started_by_id' => $starter->id,
            'state' => TaskRunState::Running,
            'reply_inbox_id' => $replyInboxId->getOrElse(null),
        ]);
        $run->save();

        return $run;
    }

    /**
     * The task's current run, opened by the starter the first time it is asked for.
     *
     * @param  Option<string>  $replyInboxId
     */
    public static function currentFor(Task $task, ActorIdentity $starter, Option $replyInboxId): self
    {
        return self::ofTask($task, $task->run_number)
            ?? self::startFor($task, $task->run_number, $starter, $replyInboxId);
    }

    /**
     * The inbox the run answers to, when its dispatcher had one.
     *
     * @return Option<string>
     */
    public function replyInboxId(): Option
    {
        return Option::fromValue($this->reply_inbox_id);
    }

    /**
     * The run under its row lock.
     *
     * @throws RecordUnavailable
     */
    public static function lockedById(string $runId): self
    {
        return self::query()->whereKey($runId)->lockForUpdate()->first()
            ?? throw RecordUnavailable::for(new RecordIdentity(self::LINK_TYPE, $runId));
    }

    /**
     * The task's run of this number, when it was started.
     */
    public static function ofTask(Task $task, int $runNumber): self|null
    {
        return self::query()->where('task_id', $task->id)->where('run_number', $runNumber)->first();
    }

    /**
     * @throws TaskRunFinished
     */
    public function requireUnfinished(): void
    {
        if ($this->state === TaskRunState::Finished) {
            throw TaskRunFinished::forRun($this->id);
        }
    }

    /**
     * @throws TaskRunFinished
     */
    public function finish(string $outcome): void
    {
        $this->requireUnfinished();
        $this->state = TaskRunState::Finished;
        $this->outcome = $outcome;
        $this->save();
    }

    /**
     * The actor that started the run.
     */
    public function starter(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->started_by_type), $this->started_by_id);
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }
}
