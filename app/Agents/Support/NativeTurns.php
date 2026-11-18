<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\StaleProcessGeneration;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverTurn;
use Carbon\CarbonImmutable;

/**
 * Checks a hook call's process generation against its runtime and records the native turns its prompts start.
 * Sessions without a runtime (launches from before the drivers, tests) pass untouched.
 */
final readonly class NativeTurns
{
    /**
     * @throws StaleProcessGeneration
     */
    public function checkGeneration(string $sessionId, int|null $generation): void
    {
        $runtime = AgentRuntime::query()->where('agent_session_id', $sessionId)->first();

        if ($runtime !== null && $generation !== null && $generation < $runtime->process_generation) {
            throw StaleProcessGeneration::of($generation, $runtime->process_generation);
        }
    }

    /**
     * Records the turn a prompt starts once per (runtime, generation, native prompt id); a repeated hook adds none.
     * The prompt's text is never stored or logged here.
     */
    public function recordPrompt(string $sessionId, int|null $generation, string|null $nativePromptId): void
    {
        $runtime = AgentRuntime::query()->where('agent_session_id', $sessionId)->first();

        if ($runtime === null || $nativePromptId === null) {
            return;
        }

        DriverTurn::recordStart($runtime->id, $generation ?? $runtime->process_generation, $nativePromptId, CarbonImmutable::now());
    }
}
