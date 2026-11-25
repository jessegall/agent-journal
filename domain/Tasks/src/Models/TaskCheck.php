<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Support\ActorIdentity;
use App\Values\PublishedResult;
use App\Values\ReadOrder;
use Carbon\CarbonImmutable;
use Domain\Tasks\Events\TaskCheckRecorded;
use Domain\Tasks\Values\TaskProof;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A check of one task run, bound from the start to the process run its caller opened for it; once that run's result is
 * published, its receipt and outcome are bound once and never change.
 *
 * @property string $id
 * @property string $task_id
 * @property string $task_run_id
 * @property int $run_number
 * @property string $operation
 * @property ActorType $caller_type
 * @property string $caller_id
 * @property string $process_run_id
 * @property string|null $result_receipt_id
 * @property string|null $outcome
 * @property Carbon $created_at
 * @property Carbon|null $bound_at
 * @property-read TaskProof $proof
 */
#[Fillable([
    'task_id',
    'task_run_id',
    'run_number',
    'operation',
    'caller_type',
    'caller_id',
    'process_run_id',
])]
final class TaskCheck extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'run_number' => 'integer',
            'caller_type' => ActorType::class,
            'bound_at' => 'datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The check of the task run the caller asked for, bound to the process run it opened.
     */
    public static function create(
        TaskRun $run,
        string $operation,
        ActorIdentity $caller,
        string $processRunId,
    ): self {
        $check = new self([
            'task_id' => $run->task_id,
            'task_run_id' => $run->id,
            'run_number' => $run->run_number,
            'operation' => $operation,
            'caller_type' => $caller->type,
            'caller_id' => $caller->id,
            'process_run_id' => $processRunId,
        ]);

        $check->assertSaved($check->save());

        return $check;
    }

    // ----------[ Mutations ]----------

    /**
     * Binds the process run's published result once: a check already bound keeps its first result.
     */
    public function bind(PublishedResult $result): void
    {
        if ($this->result_receipt_id !== null) {
            return;
        }

        $this->result_receipt_id = $result->receiptId;
        $this->outcome = $result->outcome->value;
        $this->bound_at = Carbon::now();
        $this->assertSaved($this->save());
        $this->raise(new TaskCheckRecorded($this->task_id, $this->id));
    }

    // ----------[ Predicates ]----------

    public function isBound(): bool
    {
        return $this->result_receipt_id !== null;
    }

    // ----------[ Transformers ]----------

    /**
     * A task's checks in the order they were asked for; the table has no updated_at.
     */
    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by(['task_checks.task_id'], 'task_checks.id');
    }

    /**
     * The check as Tasks' proofs read gives it, no model leaving the domain.
     */
    public function proof(): TaskProof
    {
        return new TaskProof(
            $this->id,
            $this->operation,
            $this->run_number,
            $this->caller_type,
            $this->caller_id,
            $this->process_run_id,
            $this->result_receipt_id,
            $this->outcome,
            CarbonImmutable::parse($this->created_at),
            $this->bound_at === null ? null : CarbonImmutable::parse($this->bound_at),
        );
    }

    // ----------[ Queries ]----------

    /**
     * The check bound to the process run, if any.
     */
    public static function ofProcessRun(string $runId): self|null
    {
        return self::query()->ofRun($runId)->first();
    }

    /**
     * At most limit of the task's checks after the check id, newest first.
     *
     * @return Collection<int, self>
     */
    public static function pageOf(string $taskId, string|null $afterId, int $limit): Collection
    {
        return self::query()->ofTask($taskId)->olderThan($afterId)->newestFirst()->limit($limit)->get();
    }

    // ----------[ Scopes ]----------

    /**
     * The run's check.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRun(Builder $query, string $runId): void
    {
        $query->where('process_run_id', $runId);
    }

    /**
     * The task's checks.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofTask(Builder $query, string $taskId): void
    {
        $query->where('task_id', $taskId);
    }

    /**
     * The checks older than that check; all of them with none.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function olderThan(Builder $query, string|null $afterId): void
    {
        $query->when($afterId !== null, fn (Builder $older) => $older->where('id', '<', $afterId));
    }
}
