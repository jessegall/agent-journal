<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Processes\Values\PublishedResult;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Reads\Values\ReadOrder;
use Carbon\CarbonImmutable;
use Domain\Tasks\Api\Events\TaskCheckRecorded;
use Domain\Tasks\Api\TaskProof;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
#[Fillable(['task_id', 'task_run_id', 'run_number', 'operation', 'caller_type', 'caller_id', 'process_run_id'])]
final class TaskCheck extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'run_number' => 'integer',
            'caller_type' => ActorType::class,
            'created_at' => 'datetime',
            'bound_at' => 'datetime',
        ];
    }

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

    // ----------[ Queries ]----------

    /**
     * The check bound to the process run, if any.
     */
    public static function ofProcessRun(string $runId): self|null
    {
        return self::query()->where('process_run_id', $runId)->first();
    }

    /**
     * At most limit of the task's checks after the check id, newest first.
     *
     * @return Collection<int, self>
     */
    public static function pageOf(string $taskId, string|null $afterId, int $limit): Collection
    {
        return self::query()->where('task_id', $taskId)
            ->when($afterId !== null, fn (Builder $query) => $query->where('id', '<', $afterId))
            ->orderByDesc('id')->limit($limit)->get();
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

    // ----------[ Answers ]----------

    public function isBound(): bool
    {
        return $this->result_receipt_id !== null;
    }

    /**
     * A task's checks in the order they were asked for; the table has no updated_at.
     */
    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by(['task_checks.task_id'], 'task_checks.id');
    }

    // ----------[ Accessors ]----------

    /**
     * The check as Tasks' proofs read gives it, no model leaving the domain.
     *
     * @return Attribute<TaskProof, never>
     */
    protected function proof(): Attribute
    {
        return Attribute::get(fn () => new TaskProof(
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
        ));
    }
}
