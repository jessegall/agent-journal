<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use App\Values\ReadOrder;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Values\TaskTransition;
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
 * @property ?string $task_run_id
 * @property ?int $run_number
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property TaskState $from_state
 * @property TaskState $to_state
 * @property ?string $text
 * @property int $sequence
 * @property Carbon $created_at
 * @property mixed $transition attribute
 */
#[Table('task_history')]
final class TaskHistoryEntry extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
            'actor_type' => ActorType::class,
            'from_state' => TaskState::class,
            'to_state' => TaskState::class,
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
        ActorIdentity $actor,
        TaskState $fromState,
        string|null $text,
    ): self {
        $entry = new self();
        $entry->task_id = $task->id;
        $entry->task_run_id = $run?->id;
        $entry->run_number = $run?->run_number;
        $entry->actor_type = $actor->type;
        $entry->actor_id = $actor->id;
        $entry->from_state = $fromState;
        $entry->to_state = $task->state;
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
    public static function pageOf(string $taskId, int|null $beforeSequence, int $limit): Collection
    {
        return self::query()->ofTask($taskId)->before($beforeSequence)->newestSequenceFirst()->newestFirst()->limit($limit)->get();
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
