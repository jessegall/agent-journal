<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Records\Values\ReadOrder;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Models\Concerns\TaskSequence;
use Domain\Tasks\Values\TaskLogLine;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;

/**
 * @property string $id
 * @property string $task_id
 * @property string $task_run_id
 * @property int $run_number
 * @property string $actor_type
 * @property string $actor_id
 * @property string $text
 * @property int $sequence
 * @property CarbonImmutable $created_at
 * @property-read mixed $line
 *
 * @mixin \Eloquent
 */
final class TaskLogEntry extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;
    use RaisesEvents;
    use TaskSequence;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'run_number' => 'integer',
            'sequence' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Writes the line against the run after the task's last line and tells it; the caller holds the task's row, so
     * two lines of one task never take the same place.
     */
    public static function create(Task $task, TaskRun $run, ActorReference $actor, string $text): self
    {
        $entry = new self();
        $entry->task_id = $task->id;
        $entry->task_run_id = $run->id;
        $entry->run_number = $run->run_number;
        $entry->actor_type = $actor->type;
        $entry->actor_id = $actor->id;
        $entry->text = $text;
        $entry->sequence = self::resolveNextSequence($task);

        $entry->saveAndAssert();
        $entry->raise(new TaskLogged($task->id, $entry->id));

        return $entry;
    }

    // ----------[ Transformers ]----------

    /**
     * The lines of one task in their order; the table has no updated_at.
     */
    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by(['task_log_entries.task_id', 'task_log_entries.sequence'], 'task_log_entries.id');
    }

    // ----------[ Accessors ]----------

    /**
     * The line as Tasks' log read gives it, no model leaving the domain.
     *
     * @return Attribute<TaskLogLine, never>
     */
    protected function line(): Attribute
    {
        return Accessor::get(fn () => new TaskLogLine(
            $this->id,
            $this->run_number,
            $this->actor_type,
            $this->actor_id,
            $this->text,
            $this->sequence,
            CarbonImmutable::parse($this->created_at),
        ));
    }

    // ----------[ Queries ]----------

    /**
     * At most limit of the task's lines after the sequence, oldest first, or before it, newest first.
     *
     * @return Collection<int, self>
     */
    public static function findPageAfter(string $taskId, int $sequence, int $limit): Collection
    {
        return self::query()->ofTask($taskId)->after($sequence)->inSequenceOrder()->oldestFirst()->limit($limit)->get();
    }

    /**
     * @return Collection<int, self>
     */
    public static function findPageBefore(string $taskId, int|null $sequence, int $limit): Collection
    {
        return self::query()->ofTask($taskId)
            ->before($sequence)
            ->newestSequenceFirst()
            ->newestFirst()
            ->limit($limit)
            ->get();
    }

    /**
     * The sequence the task's next log entry takes: one past its newest.
     */
    public static function resolveNextSequence(Task $task): int
    {
        return (int) self::query()->ofTask($task->id)->max('sequence') + 1;
    }

    // ----------[ Scopes ]----------

    /**
     * Lines of the tasks the subquery selects, such as the tasks a reader may search.
     *
     * @param  Builder<self>  $query
     * @param  Builder<Task>  $tasks
     */
    #[Scope]
    protected function ofTasksIn(Builder $query, Builder $tasks): void
    {
        $query->whereIn('task_id', $tasks->select('id'));
    }

    /**
     * Lines after one line in the order search walks them: by parent task, then by line id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function afterSearchKey(Builder $query, string $taskId, string $entryId): void
    {
        $query->where(fn (Builder $later) => $later->where('task_id', '>', $taskId)
            ->orWhere(fn (Builder $same) => $same->where('task_id', $taskId)->where('id', '>', $entryId)));
    }

    /**
     * The entries after that sequence number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function after(Builder $query, int $sequence): void
    {
        $query->where('sequence', '>', $sequence);
    }

    /**
     * The entries in the order of their sequence number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inSequenceOrder(Builder $query): void
    {
        $query->orderBy('sequence');
    }
}
