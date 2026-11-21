<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Models\DriverRequest;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One request on a runtime's ledger as stored: its place, progress and outcome, the timing expected when it was
 * accepted and the time it last changed, why it is held, and the recoveries a user may run on it now, with the
 * row version they must name.
 */
#[TypeScript]
final class DriverRequestStatus extends Data
{
    public function __construct(
        public readonly string $requestId,
        public readonly int $sequence,
        public readonly DriverOperation $operation,
        public readonly RequestProgress $progress,
        public readonly RequestOutcome|null $outcome,
        public readonly ExpectedTiming $expectedTiming,
        public readonly string|null $changedAt,
        public readonly HoldReason $hold,
        public readonly string|null $script = null,
        public readonly int|null $scriptStep = null,
        public readonly string|null $scriptEvidence = null,
        public readonly int $rowVersion = 0,
        public readonly bool $canRetry = false,
        public readonly bool $canCancel = false,
        public readonly bool $canResolve = false,
        public readonly bool $canResumeScript = false,
        public readonly bool $canCancelScript = false,
    ) {}

    /**
     * A driver request as stored, for readers.
     */
    public static function fromDriverRequest(DriverRequest $request): self
    {
        return self::from([
            'requestId' => $request->id,
            'sequence' => $request->sequence,
            'operation' => $request->operation,
            'progress' => $request->progress,
            'outcome' => $request->outcome,
            'expectedTiming' => $request->expected_timing,
            'changedAt' => $request->updated_at?->toIso8601String(),
            'hold' => $request->hold_reason,
            'script' => $request->script_id,
            'scriptStep' => $request->script_step,
            'scriptEvidence' => $request->script_evidence,
            'rowVersion' => $request->row_version,
            'canRetry' => $request->canRetry(),
            'canCancel' => $request->canCancel(),
            'canResolve' => $request->canResolve(),
            'canResumeScript' => $request->canResumeScript(),
            'canCancelScript' => $request->isStoppedKeyScript(),
        ]);
    }
}
