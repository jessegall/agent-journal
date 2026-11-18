<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One request on a runtime's ledger as stored: its place, progress and outcome, the timing expected when it was
 * accepted and the time it last changed, and why it is held.
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
    ) {}

}
