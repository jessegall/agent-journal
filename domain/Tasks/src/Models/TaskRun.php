<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Models\Concerns\FindsForUpdate;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use Domain\Tasks\Enums\TaskRunState;
use Domain\Tasks\Events\TaskRunEnded;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

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
 */
#[Table('task_runs')]
#[Fillable(['task_id', 'run_number', 'started_by_type', 'started_by_id', 'state', 'outcome'])]
final class TaskRun extends Model implements Assignable, EventSource, ReadableModel
{
    use BoundedReads;
    use FindsForUpdate;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'tasks.run';

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return ['run_number' => 'integer', 'state' => TaskRunState::class];
    }

    // ----------[ Constructors ]----------

    /**
     * A new run started by the starter, answering to the inbox the starter replies at, fixed from now on.
     */
    public static function create(Task $task, int $number, ActorIdentity $starter): self
    {
        $run = new self([
            'task_id' => $task->id,
            'run_number' => $number,
            'started_by_type' => $starter->type->value,
            'started_by_id' => $starter->id,
            'state' => TaskRunState::Running,
        ]);

        $run->save();

        return $run;
    }

    // ----------[ Queries ]----------

    /**
     * The task's current run, opened by the starter the first time it is asked for.
     */
    public static function currentFor(Task $task, ActorIdentity $starter): self
    {
        return self::ofTask($task, $task->run_number)
            ?? self::create($task, $task->run_number, $starter);
    }

    /**
     * The started runs among exact task and run number pairs, in one bounded query; a pair never started is left out.
     *
     * @param  list<array{0: string, 1: int}>  $pairs
     * @return Collection<int, self>
     */
    public static function ofPairs(array $pairs): Collection
    {
        if ($pairs === []) {
            return new Collection();
        }

        return self::query()
            ->where(function (Builder $query) use ($pairs): void {
                foreach ($pairs as [$taskId, $runNumber]) {
                    $query->orWhere(
                        fn (Builder $pair) => $pair->where('task_id', $taskId)->where('run_number', $runNumber),
                    );
                }
            })
            ->limit(count($pairs))
            ->get();
    }

    /**
     * The task's run of this number, when it was started.
     */
    public static function ofTask(Task $task, int $number): self|null
    {
        return self::query()->where('task_id', $task->id)->where('run_number', $number)->first();
    }

    // ----------[ Mutations ]----------

    /**
     * @throws TaskRunFinished
     */
    public function finish(string $outcome): void
    {
        if ($this->isFinished()) {
            throw TaskRunFinished::forRun($this->id);
        }

        $this->state = TaskRunState::Finished;
        $this->outcome = $outcome;
        $this->assertSaved($this->save());
        $this->raise(new TaskRunEnded($this->id, $this->task_id));
    }

    // ----------[ Answers ]----------

    public function isFinished(): bool
    {
        return $this->state === TaskRunState::Finished;
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    // ----------[ Accessors ]----------

    /**
     * The actor that started the run.
     *
     * @return Attribute<ActorIdentity, never>
     */
    protected function starter(): Attribute
    {
        return Attribute::get(
            fn () => new ActorIdentity(ActorType::from($this->started_by_type), $this->started_by_id),
        )->withoutObjectCaching();
    }
}
