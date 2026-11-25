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
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use Domain\Tasks\Enums\TaskRunState;
use Domain\Tasks\Events\TaskRunEnded;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $task_id
 * @property int $run_number
 * @property string $started_by_type
 * @property string $started_by_id
 * @property TaskRunState $state
 * @property ?string $outcome
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $starter attribute
 */
#[Table('task_runs')]
final class TaskRun extends Model implements Assignable, EventSource, ReadableModel
{
    use BoundedReads;
    use FindsForUpdate;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'run_number' => 'integer',
            'state' => TaskRunState::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new run started by the starter, answering to the inbox the starter replies at, fixed from now on.
     */
    public static function create(Task $task, int $number, ActorIdentity $starter): self
    {
        $run = new self();
        $run->task_id = $task->id;
        $run->run_number = $number;
        $run->started_by_type = $starter->type->value;
        $run->started_by_id = $starter->id;
        $run->state = TaskRunState::Running;

        $run->save();

        return $run;
    }

    // ----------[ Mutations ]----------

    /**
     * @throws TaskRunFinished
     */
    public function finish(string $outcome): void
    {
        $this->assertNotFinished();

        $this->state = TaskRunState::Finished;
        $this->outcome = $outcome;
        $this->assertSaved($this->save());
        $this->raise(new TaskRunEnded($this->id, $this->task_id));
    }

    // ----------[ Predicates ]----------

    public function isFinished(): bool
    {
        return $this->state === TaskRunState::Finished;
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
     * @return Attribute<ActorIdentity, never>
     */
    protected function starter(): Attribute
    {
        return Accessor::get(fn () => new ActorIdentity(ActorType::from($this->started_by_type), $this->started_by_id));
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
            ->ofAnyPair($pairs)
            ->limit(count($pairs))
            ->get();
    }

    /**
     * The task's run of this number, when it was started.
     */
    public static function ofTask(Task $task, int $number): self|null
    {
        return self::query()->ofRun($task->id, $number)->first();
    }

    // ----------[ Scopes ]----------

    /**
     * The task's run of that number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRun(Builder $query, string $taskId, int $runNumber): void
    {
        $query->where('task_id', $taskId)->where('run_number', $runNumber);
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
