<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\DriverOperation;
use App\Enums\ExpectedTiming;
use App\Enums\HoldReason;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
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
        // An uncertain delivery may be sent again as a new request, which may arrive twice.
        public readonly bool $canSendAgain = false,
        public readonly bool $canResumeScript = false,
        public readonly bool $canCancelScript = false,
    ) {}
}
