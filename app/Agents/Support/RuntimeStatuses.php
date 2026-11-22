<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Data\DriverRequestStatus;
use App\Agents\Data\RuntimeSetting;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use Carbon\CarbonImmutable;

/**
 * How a runtime and a driver request become the statuses readers see; kept out of the exported Data classes.
 */
final readonly class RuntimeStatuses
{
    /**
     * A runtime as stored, read at the given time: its settings in their three states and how old its facts are.
     */
    public static function ofRuntime(AgentRuntime $runtime, CarbonImmutable $now): RuntimeStatus
    {
        $settingsAge = $runtime->settingsAge($now);

        return RuntimeStatus::from([
            'runtimeId' => $runtime->id,
            'agentId' => $runtime->session->agent_id,
            'sessionId' => $runtime->agent_session_id,
            'driver' => $runtime->driver_key,
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
            'variant' => $runtime->mode,
            'watchers' => $runtime->watcherCount(),
        ]);
    }

    /**
     * A driver request as stored, for readers.
     */
    public static function ofRequest(DriverRequest $request): DriverRequestStatus
    {
        return DriverRequestStatus::from([
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
