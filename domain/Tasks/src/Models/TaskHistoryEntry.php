<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Values\ReadOrder;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Values\TaskTransition;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;

/**
 * @property string $id
 * @property string $task_id
 * @property string|null $task_run_id
 * @property int|null $run_number
 * @property string $actor_type
 * @property string $actor_id
 * @property TaskStatus $from_state
 * @property TaskStatus $to_state
 * @property string|null $text
 * @property int $sequence
 * @property CarbonImmutable $created_at
 * @property-read mixed $transition
 *
 * @mixin \Eloquent
 */
#[Table('task_history')]
final class TaskHistoryEntry extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'run_number' => 'integer',
            'from_state' => TaskStatus::class,
            'to_state' => TaskStatus::class,
            'sequence' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Appends the task's change under the id its fact names, after the task's last entry; the caller holds the task's
     * row, so two changes of one task never take the same place.
     */
    public static function create(
        string $id,
        Task $task,
        TaskRun|null $run,
        ActorReference $actor,
        TaskStatus $fromState,
        string|null $text,
    ): self {
        $entry = new self();
        $entry->task_id = $task->id;
        $entry->task_run_id = $run?->id;
        $entry->run_number = $run?->run_number;
        $entry->actor_type = $actor->type;
        $entry->actor_id = $actor->id;
        $entry->from_state = $fromState;
        $entry->to_state = $task->status;
        $entry->text = $text;
        $entry->sequence = self::lastSequenceOf($task->id) + 1;

        $entry->id = $id;
        $entry->save();

        return $entry;
    }

    // ----------[ Transformers ]----------

    /**
     * The entries of one task in their order; the table has no updated_at.
     */
    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by([
            'task_history.task_id',
            'task_history.sequence',
        ], 'task_history.id');
    }

    // ----------[ Accessors ]----------

    /**
     * The entry as Tasks' history read gives it, no model leaving the domain.
     *
     * @return Attribute<TaskTransition, never>
     */
    protected function transition(): Attribute
    {
        return Accessor::get(fn () => new TaskTransition(
            $this->id,
            $this->run_number,
            $this->actor_type,
            $this->actor_id,
            $this->from_state,
            $this->to_state,
            $this->text,
            $this->sequence,
            CarbonImmutable::parse($this->created_at),
        ));
    }

    // ----------[ Internals ]----------

    private static function lastSequenceOf(string $taskId): int
    {
        return (int) self::query()->ofTask($taskId)->max('sequence');
    }

    // ----------[ Queries ]----------

    /**
     * At most limit of the task's entries before the sequence, newest first, ordered by (sequence, id).
     *
     * @return Collection<int, self>
     */
    public static function findPageOf(string $taskId, int|null $beforeSequence, int $limit): Collection
    {
        return self::query()->ofTask($taskId)
            ->before($beforeSequence)
            ->newestSequenceFirst()
            ->newestFirst()
            ->limit($limit)
            ->get();
    }

    // ----------[ Scopes ]----------

    /**
     * The task's history.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofTask(Builder $query, string $taskId): void
    {
        $query->where('task_id', $taskId);
    }

    /**
     * The entries before that sequence number; all of them with none.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function before(Builder $query, int|null $sequence): void
    {
        $query->when($sequence !== null, fn (Builder $earlier) => $earlier->where('sequence', '<', $sequence));
    }

    /**
     * The entries newest sequence number first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestSequenceFirst(Builder $query): void
    {
        $query->orderByDesc('sequence');
    }
}
