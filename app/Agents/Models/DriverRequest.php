<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Data\DriverRequestStatus;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Support\ClaimedRequest;
use App\Agents\Support\DriverReceipt;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One accepted request to a runtime's driver, in the order it was accepted: its payload, attempts, progress and
 * outcome, expected and actual timing, wake watermarks and key script progress (doc 40, sections 14 to 20).
 *
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $sequence
 * @property DriverOperation $operation
 * @property string $idempotency_key
 * @property string $payload_digest
 * @property string|null $message
 * @property string|null $model
 * @property string|null $effort
 * @property RequestProgress $progress
 * @property RequestOutcome|null $outcome
 * @property ExpectedTiming $expected_timing
 * @property CarbonImmutable|null $expected_observed_at
 * @property CarbonImmutable|null $updated_at
 * @property string|null $actual_binding
 * @property int $attempt_version
 * @property int|null $wake_requested
 * @property int|null $wake_acknowledged
 * @property string|null $script_id
 * @property int|null $script_version
 * @property int|null $script_step
 * @property HoldReason $hold_reason
 * @property int $row_version
 */
#[Fillable(['agent_runtime_id', 'sequence', 'operation', 'idempotency_key', 'payload_digest', 'message', 'model', 'effort', 'expected_timing', 'expected_observed_at'])]
final class DriverRequest extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'operation' => DriverOperation::class,
            'progress' => RequestProgress::class,
            'outcome' => RequestOutcome::class,
            'expected_timing' => ExpectedTiming::class,
            'expected_observed_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
            'hold_reason' => HoldReason::class,
        ];
    }

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    public function accept(): void
    {
        $this->moveTo(RequestProgress::Accepted);
        $this->hold_reason = HoldReason::None;
        $this->save();
    }

    public function stage(): void
    {
        $this->moveTo(RequestProgress::Staged);
        $this->save();
    }

    /**
     * Marks the request as being carried out by attempt version $attempt, which later reports must match.
     */
    public function beginApplying(int $attempt): void
    {
        $this->moveTo(RequestProgress::Applying);
        $this->attempt_version = $attempt;
        $this->save();
    }

    public function markApplied(string $actualBinding, RequestOutcome|null $outcome = null): void
    {
        $this->moveTo(RequestProgress::Applied);
        $this->actual_binding = $actualBinding;
        $this->outcome = $outcome;
        $this->save();
    }

    public function supersede(): void
    {
        $this->finish(RequestProgress::Superseded, null);
    }

    public function cancel(): void
    {
        $this->finish(RequestProgress::Cancelled, null);
    }

    public function fail(RequestOutcome $outcome): void
    {
        $this->finish(RequestProgress::Failed, $outcome);
    }

    public function markUncertain(): void
    {
        $this->finish(RequestProgress::DeliveryUncertain, null);
    }

    public function hold(HoldReason $reason): void
    {
        $this->hold_reason = $reason;
        $this->row_version++;
        $this->save();
    }

    /**
     * What the caller who asked for this request is told: where it stands and the timing to expect.
     */
    public function receipt(): DriverReceipt
    {
        return new DriverReceipt($this->id, $this->sequence, $this->operation, $this->progress, $this->expected_timing, $this->expected_observed_at?->toIso8601String());
    }

    /**
     * The request as its host receives it to carry out.
     */
    public function claimed(): ClaimedRequest
    {
        return new ClaimedRequest($this->agent_runtime_id, $this->id, $this->sequence, $this->attempt_version, $this->operation->value, $this->message, $this->model, $this->effort);
    }

    /**
     * The request as stored, for readers.
     */
    public function status(): DriverRequestStatus
    {
        return new DriverRequestStatus($this->id, $this->sequence, $this->operation, $this->progress, $this->outcome, $this->expected_timing, $this->updated_at?->toIso8601String(), $this->hold_reason);
    }

    /**
     * Claims the wake up to the requested watermark, so a later wake request raises it instead of adding a row.
     */
    public function claimWake(int $requested): void
    {
        $this->wake_requested = $this->wake_requested === null ? $requested : max($requested, $this->wake_requested);
        $this->row_version++;
        $this->save();
    }

    public function acknowledgeWake(int $acknowledged): void
    {
        $this->wake_acknowledged = $this->wake_acknowledged === null ? $acknowledged : max($acknowledged, $this->wake_acknowledged);
        $this->row_version++;
        $this->save();
    }

    private function finish(RequestProgress $progress, RequestOutcome|null $outcome): void
    {
        $this->moveTo($progress);
        $this->outcome = $outcome;
        $this->save();
    }

    private function moveTo(RequestProgress $progress): void
    {
        $this->progress = $progress;
        $this->row_version++;
    }
}
