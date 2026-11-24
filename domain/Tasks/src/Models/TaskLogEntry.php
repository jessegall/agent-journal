<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Support\ActorIdentity;
use App\Values\ReadOrder;
use Carbon\CarbonImmutable;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Values\TaskLogLine;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One line of a task run's log, kept against the run that was current when it was written, in the task's order.
 *
 * @property string $id
 * @property string $task_id
 * @property string $task_run_id
 * @property int $run_number
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string $text
 * @property int $sequence
 * @property Carbon $created_at
 * @property-read TaskLogLine $line
 */
#[Fillable(['task_id', 'task_run_id', 'run_number', 'actor_type', 'actor_id', 'text', 'sequence'])]
final class TaskLogEntry extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'run_number' => 'integer',
            'actor_type' => ActorType::class,
            'sequence' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Writes the line against the run after the task's last line and tells it; the caller holds the task's row, so
     * two lines of one task never take the same place.
     */
    public static function create(Task $task, TaskRun $run, ActorIdentity $actor, string $text): self
    {
        $entry = new self([
            'task_id' => $task->id,
            'task_run_id' => $run->id,
            'run_number' => $run->run_number,
            'actor_type' => $actor->type,
            'actor_id' => $actor->id,
            'text' => $text,
            'sequence' => (int) self::query()->where('task_id', $task->id)->max('sequence') + 1,
        ]);

        $entry->assertSaved($entry->save());
        $entry->raise(new TaskLogged($task->id, $entry->id));

        return $entry;
    }

    // ----------[ Queries ]----------

    /**
     * At most limit of the task's lines after the sequence, oldest first, or before it, newest first.
     *
     * @return Collection<int, self>
     */
    public static function pageAfter(string $taskId, int $sequence, int $limit): Collection
    {
        return self::query()->where('task_id', $taskId)->where('sequence', '>', $sequence)
            ->orderBy('sequence')->orderBy('id')->limit($limit)->get();
    }

    /**
     * @return Collection<int, self>
     */
    public static function pageBefore(string $taskId, int|null $sequence, int $limit): Collection
    {
        return self::query()->where('task_id', $taskId)
            ->when($sequence !== null, fn (Builder $query) => $query->where('sequence', '<', $sequence))
            ->orderByDesc('sequence')->orderByDesc('id')->limit($limit)->get();
    }

    // ----------[ Answers ]----------

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
        return Attribute::get(fn () => new TaskLogLine(
            $this->id,
            $this->run_number,
            $this->actor_type,
            $this->actor_id,
            $this->text,
            $this->sequence,
            CarbonImmutable::parse($this->created_at),
        ));
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
}
