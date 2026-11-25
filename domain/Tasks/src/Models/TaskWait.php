<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Assignments\ActorType;
use App\Support\ActorIdentity;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Events\TaskWaitChanged;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $dependent_task_id
 * @property string $prerequisite_task_id
 * @property ActorType $created_by_type
 * @property string $created_by_id
 * @property ?Carbon $waived_at
 * @property ?ActorType $waived_by_type
 * @property ?string $waived_by_id
 * @property ?string $waive_reason
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class TaskWait extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_by_type' => ActorType::class,
            'waived_at' => 'datetime',
            'waived_by_type' => ActorType::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The dependent now waits on the prerequisite, added by the actor.
     */
    public static function create(Task $dependent, Task $prerequisite, ActorIdentity $actor): self
    {
        $wait = new self();
        $wait->dependent_task_id = $dependent->id;
        $wait->prerequisite_task_id = $prerequisite->id;
        $wait->created_by_type = $actor->type;
        $wait->created_by_id = $actor->id;

        $wait->assertSaved($wait->save());

        $wait->raise(new TaskWaitChanged(
            $wait->id,
            $wait->dependent_task_id,
            $wait->prerequisite_task_id,
            TaskWaitChange::Added,
        ));

        return $wait;
    }

    // ----------[ Mutations ]----------

    /**
     * Waives the wait for the actor with a reason; the dependent no longer waits on it.
     */
    public function waive(ActorIdentity $actor, string $reason): void
    {
        $this->waived_at = Carbon::now();
        $this->waived_by_type = $actor->type;
        $this->waived_by_id = $actor->id;
        $this->waive_reason = $reason;
        $this->assertSaved($this->save());

        $this->raise(new TaskWaitChanged(
            $this->id,
            $this->dependent_task_id,
            $this->prerequisite_task_id,
            TaskWaitChange::Waived,
        ));
    }

    /**
     * Removes the wait; its history keeps that it was there.
     */
    public function remove(): void
    {
        $this->delete();

        $this->raise(new TaskWaitChanged(
            $this->id,
            $this->dependent_task_id,
            $this->prerequisite_task_id,
            TaskWaitChange::Removed,
        ));
    }

    // ----------[ Predicates ]----------

    public function isWaived(): bool
    {
        return $this->waived_at !== null;
    }

    /**
     * The one rule of a wait: met once it is waived or its prerequisite is finished. Open, started, blocked, cancelled
     * and a prerequisite that is gone (no state) all leave it outstanding.
     */
    public function isSatisfiedBy(TaskState|null $prerequisiteState): bool
    {
        return $this->isWaived() || $prerequisiteState === TaskState::Finished;
    }

    // ----------[ Queries ]----------

    /**
     * The wait of the dependent on the prerequisite, if there is one.
     */
    public static function between(string $dependentId, string $prerequisiteId): self|null
    {
        return self::query()->ofDependents([$dependentId])->onPrerequisite($prerequisiteId)->first();
    }

    /**
     * The ids of the tasks the given tasks wait on directly, at most limit of them.
     *
     * @param  list<string>  $dependentIds
     * @return list<string>
     */
    public static function prerequisiteIdsOf(array $dependentIds, int $limit): array
    {
        $ids = self::query()
            ->ofDependents($dependentIds)
            ->onePerPrerequisite()
            ->readUpTo($limit)
            ->pluck('prerequisite_task_id');

        return array_values(array_map(strval(...), $ids->all()));
    }

    /**
     * The ids of the tasks with a wait not met: not waived, and its prerequisite gone or not finished, as a subquery
     * a task query narrows by before its count and limit.
     *
     * @return Builder<self>
     */
    public static function unmetDependentIds(): Builder
    {
        return self::query()->select('dependent_task_id')->unmet();
    }

    /**
     * The given tasks that wait on any task.
     *
     * @param  list<string>  $ids
     * @return list<string>
     */
    public static function dependentIdsAmong(array $ids): array
    {
        $waiting = self::query()
            ->ofDependents($ids)
            ->onePerDependent()
            ->readAll('the waiting tasks among a page')
            ->pluck('dependent_task_id');

        return array_values(array_map(strval(...), $waiting->all()));
    }

    /**
     * @return Collection<int, self>
     */
    public static function waitsOf(string $dependentId, int $limit): Collection
    {
        return self::query()->ofDependents([$dependentId])->oldestFirst()->limit($limit)->get();
    }

    /**
     * @return Collection<int, self>
     */
    public static function holdersOf(string $prerequisiteId, int $limit): Collection
    {
        return self::query()->onPrerequisite($prerequisiteId)->oldestFirst()->limit($limit)->get();
    }

    /**
     * The waits among these tasks only: both the task that waits and the task it waits on are among them.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function within(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        $among = array_flip($ids);

        return array_values(array_filter(
            self::waitsOfTasks($ids)->all(),
            fn (self $wait) => isset($among[$wait->prerequisite_task_id]),
        ));
    }

    /**
     * @param  list<string>  $dependentIds
     * @return Collection<int, self>
     */
    public static function waitsOfTasks(array $dependentIds): Collection
    {
        return self::query()->ofDependents($dependentIds)->readAll('the direct waits of the tasks asked about')->get();
    }

    // ----------[ Scopes ]----------

    /**
     * The waits of the waiting tasks.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $dependentIds
     */
    #[Scope]
    protected function ofDependents(Builder $query, array $dependentIds): void
    {
        $query->whereIn('dependent_task_id', $dependentIds);
    }

    /**
     * The waits on the task.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onPrerequisite(Builder $query, string $prerequisiteId): void
    {
        $query->where('prerequisite_task_id', $prerequisiteId);
    }

    /**
     * One row for each task waited on.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onePerPrerequisite(Builder $query): void
    {
        $query->groupBy('prerequisite_task_id');
    }

    /**
     * One row for each waiting task.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onePerDependent(Builder $query): void
    {
        $query->groupBy('dependent_task_id');
    }

    /**
     * The waits not waived whose task waited on is not finished.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unmet(Builder $query): void
    {
        $finished = Task::query()->keys()->finished();

        $query->whereNull('waived_at')->whereNotIn('prerequisite_task_id', $finished);
    }
}
