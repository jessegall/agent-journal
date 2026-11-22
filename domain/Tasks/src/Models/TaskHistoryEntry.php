<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Reads\Values\ReadOrder;
use Carbon\CarbonImmutable;
use Domain\Tasks\Api\TaskTransition;
use Domain\Tasks\Enums\TaskState;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One committed change of a task, kept for good: written once in the change's transaction and never changed, so a
 * later run never rewrites what an earlier run's block or finish said.
 *
 * @property string $id
 * @property string $task_id
 * @property string|null $task_run_id
 * @property int|null $run_number
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property TaskState $from_state
 * @property TaskState $to_state
 * @property string|null $text
 * @property int $sequence
 * @property Carbon $created_at
 * @property-read TaskTransition $transition
 */
#[Table('task_history')]
#[Fillable([
    'task_id',
    'task_run_id',
    'run_number',
    'actor_type',
    'actor_id',
    'from_state',
    'to_state',
    'text',
    'sequence',
])]
final class TaskHistoryEntry extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

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
            'created_at' => 'datetime',
        ];
    }

    /**
     * Appends the task's change under the id its fact names, after the task's last entry; the caller holds the task's
     * row, so two changes of one task never take the same place.
     */
    public static function recordChange(
        string $id,
        Task $task,
        TaskRun|null $run,
        ActorIdentity $actor,
        TaskState $fromState,
        string|null $text,
    ): self {
        $entry = new self([
            'task_id' => $task->id,
            'task_run_id' => $run?->id,
            'run_number' => $run?->run_number,
            'actor_type' => $actor->type,
            'actor_id' => $actor->id,
            'from_state' => $fromState,
            'to_state' => $task->state,
            'text' => $text,
            'sequence' => self::lastSequenceOf($task->id) + 1,
        ]);
        $entry->id = $id;
        $entry->save();

        return $entry;
    }

    // ----------[ Queries ]----------

    /**
     * At most limit of the task's entries before the sequence, newest first, ordered by (sequence, id).
     *
     * @return Collection<int, self>
     */
    public static function pageOf(string $taskId, int|null $beforeSequence, int $limit): Collection
    {
        return self::query()->where('task_id', $taskId)
            ->when($beforeSequence !== null, fn ($query) => $query->where('sequence', '<', $beforeSequence))
            ->orderByDesc('sequence')->orderByDesc('id')->limit($limit)->get();
    }

    // ----------[ Answers ]----------

    /**
     * The entry as Tasks' history read gives it, no model leaving the domain.
     *
     * @return Attribute<TaskTransition, never>
     */
    protected function transition(): Attribute
    {
        return Attribute::get(fn () => new TaskTransition(
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

    /**
     * The entries of one task in their order; the table has no updated_at.
     */
    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by(['task_history.task_id', 'task_history.sequence'], 'task_history.id');
    }

    // ----------[ Internals ]----------

    private static function lastSequenceOf(string $taskId): int
    {
        return (int) self::query()->where('task_id', $taskId)->max('sequence');
    }
}
