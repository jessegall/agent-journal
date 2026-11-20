<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\NativeTurnRecords;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\RequestProgress;
use App\Agents\Exceptions\StaleProcessGeneration;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\DriverTurn;
use Carbon\CarbonImmutable;

/**
 * Checks a hook call's process generation against its runtime, records the native turns its prompts start and
 * acknowledges the wake the call answers.
 * Sessions without a runtime (starts from before the drivers, tests) pass untouched.
 */
final readonly class NativeTurns implements NativeTurnRecords
{
    /**
     * @throws StaleProcessGeneration
     */
    public function checkGeneration(string $sessionId, int|null $generation): void
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime !== null && $generation !== null && $generation < $runtime->process_generation) {
            throw StaleProcessGeneration::of($generation, $runtime->process_generation);
        }
    }

    /**
     * An authenticated hook of the session is activity after its wake was taken: it acknowledges the watermark the
     * host claimed, and never reads or answers a message.
     */
    public function acknowledgeWake(string $sessionId, CarbonImmutable $activityAt): void
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime === null) {
            return;
        }

        DriverRequest::query()
            ->where('agent_runtime_id', $runtime->id)
            ->where('operation', DriverOperation::Wake)
            ->whereIn('progress', [RequestProgress::Staged, RequestProgress::Applying])
            ->lockForUpdate()
            ->get()
            ->each(fn (DriverRequest $wake) => $wake->acknowledgeActivityAt($activityAt));
    }

    /**
     * Records the turn a prompt starts once per (runtime, generation, native prompt id); a repeated hook adds none.
     * The prompt's text is never stored or logged here.
     */
    public function recordPrompt(string $sessionId, int|null $generation, string|null $promptId): void
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime === null || $promptId === null) {
            return;
        }

        $turnGeneration = $generation ?? $runtime->process_generation;
        DriverTurn::recordStart($runtime->id, $turnGeneration, $promptId, CarbonImmutable::now());
    }
}
