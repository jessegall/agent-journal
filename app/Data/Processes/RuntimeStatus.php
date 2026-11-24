<?php

declare(strict_types=1);

namespace App\Data\Processes;

use App\Data\Settings\RuntimeSetting;
use App\Enums\HoldReason;
use App\Enums\RuntimeActivity;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A runtime as last stored: activity and hold, the model and effort as requested, staged and observed, kept apart,
 * how old the host's last observation is, its driver and how many viewers watch its terminal. Reading it calls no host.
 */
#[TypeScript]
final class RuntimeStatus extends Data
{
    public function __construct(
        public readonly string $runtimeId,
        public readonly string $agentId,
        public readonly string $sessionId,
        public readonly string $driver,
        public readonly RuntimeActivity $activity,
        public readonly HoldReason $hold,
        public readonly RuntimeSetting $model,
        public readonly RuntimeSetting $effort,
        public readonly int|null $observationAgeSeconds,
        public readonly bool $isStale,
        public readonly int $processGeneration,
        public readonly bool $canReleaseHold,
        public readonly bool $hasScreen,
        public readonly int $watchers,
    ) {}

}
