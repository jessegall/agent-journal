<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Assignments\Contracts\Assignable;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Concerns\FindsForUpdate;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskRunStatus;
use Domain\Tasks\Events\TaskRunEnded;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Domain\Tasks\Exceptions\TaskRunMissing;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;

/**
 * @property string $id
 * @property string $task_id
 * @property int $run_number
 * @property string $started_by_type
 * @property string $started_by_id
 * @property TaskRunStatus $status
 * @property string|null $outcome
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $starter
 *
 * @mixin \Eloquent
 */
#[Table('task_runs')]
final class TaskRun extends JournalModel implements Assignable, EventSource, ReadableModel
{
    use BoundedReads;
    use FindsForUpdate;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'run_number' => 'integer',
            'status' => TaskRunStatus::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The task's current run, opened by the starter the first time it is asked for and answering to the inbox the
     * starter replies at, fixed from then on.
     */
    public static function create(Task $task, ActorReference $starter): self
    {
        $current = self::findForTask($task, $task->run_number);

        if ($current !== null) {
            return $current;
        }

        $run = new self();
        $run->task_id = $task->id;
        $run->run_number = $task->run_number;
        $run->started_by_type = $starter->type;
        $run->started_by_id = $starter->id;
        $run->status = TaskRunStatus::Running;

        $run->save();

        return $run;
    }

    // ----------[ Mutations ]----------

    /**
     * The task run finished; a run already finished is refused.
     *
     * @throws TaskRunFinished
     */
    public function finish(string $outcome): void
    {
        $this->assertNotFinished();

        $this->status = TaskRunStatus::Finished;
        $this->outcome = $outcome;
        $this->saveAndAssert();
        $this->raise(new TaskRunEnded($this->id, $this->task_id));
    }

    // ----------[ Predicates ]----------

    public function isFinished(): bool
    {
        return $this->status === TaskRunStatus::Finished;
    }

    // ----------[ Transformers ]----------

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }

    // ----------[ Accessors ]----------

    /**
     * The actor that started the run.
     *
     * @return Attribute<ActorReference, never>
     */
    protected function starter(): Attribute
    {
        return Accessor::get(fn () => ActorReference::fromStored($this->started_by_type, $this->started_by_id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses to finish a run that already finished.
     *
     * @throws TaskRunFinished
     */
    private function assertNotFinished(): void
    {
        if ($this->isFinished()) {
            throw TaskRunFinished::forRun($this->id);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The started runs among exact task and run number pairs, in one bounded query; a pair never started is left out.
     *
     * @param  list<array{0: string, 1: int}>  $pairs
     * @return Collection<int, self>
     */
    public static function findForPairs(array $pairs): Collection
    {
        if ($pairs === []) {
            return new Collection();
        }

        return self::query()
            ->ofAnyPair($pairs)
            ->limit(count($pairs))
            ->get();
    }

    /**
     * The task's run of this number, when it was started.
     */
    public static function findForTask(Task $task, int $number): self|null
    {
        return self::query()->ofRun($task->id, $number)->first();
    }

    /**
     * The task's run of that number, which must exist.
     *
     * @throws TaskRunMissing
     */
    public static function findNumberedOf(Task $task, int $number): self
    {
        return self::query()->ofRun($task->id, $number)->firstOr(
            TaskRunMissing::throwing()->forRun($task->number, $number),
        );
    }

    // ----------[ Scopes ]----------

    /**
     * The task's run of that number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRun(Builder $query, string $taskId, int $number): void
    {
        $query->where('task_id', $taskId)->where('run_number', $number);
    }

    /**
     * The runs of any of the task and run number pairs.
     *
     * @param  Builder<self>  $query
     * @param  list<array{0: string, 1: int}>  $pairs
     */
    #[Scope]
    protected function ofAnyPair(Builder $query, array $pairs): void
    {
        $query->where(function (Builder $any) use ($pairs): void {
            foreach ($pairs as [$taskId, $runNumber]) {
                $any->orWhere(fn (Builder $pair) => $pair->ofRun($taskId, $runNumber));
            }
        });
    }
}
