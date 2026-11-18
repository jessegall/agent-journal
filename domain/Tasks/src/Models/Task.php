<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Assignments\Contracts\Assignable;
use App\Assignments\Models\Support\AssignableListing;
use App\Assignments\Support\RecordIdentity;
use App\Hooks\Contracts\WorkedOnStack;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\States\Support\WorkingOnTaskStateReference;
use Domain\Tasks\Support\TaskWork;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * One task. Each start begins a run; the agent and session working on it are set only by starting it.
 * Every agent reads every task, so it has no agent limit.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $title
 * @property TaskState $state
 * @property int $run_number
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title'])]
final class Task extends Model implements Assignable, Numbered, ReadableModel, WorkedOnStack
{
    use AssignableListing, HasNumber, HasUlids, Linkable;
    use BoundedReads;

    /**
     * The stable name links and assignments use for a task.
     */
    public const string LINK_TYPE = 'tasks.task';

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'open', 'run_number' => 0];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => TaskState::class,
            'run_number' => 'integer',
        ];
    }

    /**
     * The task read under its row lock, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->first() ?? throw TaskMissing::forId($id);
    }

    /**
     * The state a frame holds while this run of the task is worked on.
     */
    public function workState(): StateReference
    {
        return WorkingOnTaskStateReference::forTask($this);
    }

    /**
     * Starts a new run; a task that is already started keeps its run.
     */
    public function start(): void
    {
        if ($this->state !== TaskState::Started) {
            $this->run_number++;
        }

        $this->state = TaskState::Started;
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
     * The summary of the task a task frame stands for; none when the frame names no task that exists.
     *
     * @return Option<TaskSummary>
     */
    public static function summaryOf(StateReference $frame): Option
    {
        if (! $frame->subject instanceof SubjectReference) {
            return None::create();
        }

        $task = self::query()->whereKey($frame->subject->id)->first();

        return $task === null ? None::create() : new Some($task->summary());
    }

    /**
     * The task as a list shows it: its number and title.
     */
    public function summary(): TaskSummary
    {
        return new TaskSummary($this->number, $this->title);
    }

    /**
     * What the stack sees of one run: the current run follows the task's state, an earlier run is over.
     */
    public function workFor(int $runNumber): TaskWork
    {
        if ($runNumber !== $this->run_number) {
            return new TaskWork($this->number, $runNumber, TaskWorkState::Finished);
        }

        return new TaskWork($this->number, $runNumber, $this->state->workState());
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }
}
