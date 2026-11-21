<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\DriverVariant;
use App\Agents\Models\AgentRuntime;
use Carbon\CarbonImmutable;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RuntimeActivity;
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
        public readonly DriverVariant $variant,
        public readonly int $watchers,
    ) {}

    /**
     * A runtime as stored, read at the given time: its settings in their three states and how old its facts are.
     */
    public static function fromAgentRuntime(AgentRuntime $runtime, CarbonImmutable $now): self
    {
        $settingsAge = $runtime->settingsAge($now);

        return self::from([
            'runtimeId' => $runtime->id,
            'agentId' => $runtime->session->agent_id,
            'sessionId' => $runtime->agent_session_id,
            'driver' => $runtime->driver,
            'activity' => $runtime->activity,
            'hold' => $runtime->hold_reason,
            'model' => RuntimeSetting::ofStates(
                $runtime->requested_model,
                $runtime->staged_model,
                $runtime->observed_model,
                $settingsAge,
            ),
            'effort' => RuntimeSetting::ofStates(
                $runtime->requested_effort,
                $runtime->staged_effort,
                $runtime->observed_effort,
                $settingsAge,
            ),
            'observationAgeSeconds' => $runtime->observationAge($now),
            'isStale' => $runtime->isStale($now),
            'processGeneration' => $runtime->process_generation,
            'canReleaseHold' => $runtime->canReleaseHold(),
            'variant' => $runtime->variant,
            'watchers' => $runtime->watcherCount(),
        ]);
    }
}
