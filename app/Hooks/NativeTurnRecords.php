<?php

declare(strict_types=1);

namespace App\Hooks;

use App\Agents\Drivers\Commands\AcknowledgeWake\AcknowledgeWakeCommand;
use App\Agents\Drivers\Commands\RecordPromptTurn\RecordPromptTurnCommand;
use App\Agents\Drivers\Contracts\NativeTurnRecords as NativeTurnRecordsContract;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Exceptions\StaleProcessGeneration;
use App\Models\Agents\AgentRuntime;

/**
 * Checks a hook call's process generation against its runtime, records the native turns its prompts start and
 * acknowledges the wake the call answers.
 * Sessions without a runtime (starts from before the drivers, tests) pass untouched.
 */
final readonly class NativeTurnRecords implements NativeTurnRecordsContract
{
    public function __construct(private CommandBus $commands) {}

    /**
     * @throws StaleProcessGeneration
     */
    public function checkGeneration(string $sessionId, int|null $generation): void
    {
        $runtime = AgentRuntime::findForSession($sessionId);

        if ($runtime !== null && $generation !== null && $generation < $runtime->process_generation) {
            throw StaleProcessGeneration::of($generation, $runtime->process_generation);
        }
    }

    /**
     * An authenticated hook of the session is activity after its wake was taken: it acknowledges the watermark the
     * host claimed, and never reads or answers a message.
     */
    public function acknowledgeWake(string $sessionId): void
    {
        $this->commands->run(new AcknowledgeWakeCommand($sessionId));
    }

    /**
     * Records the turn a prompt starts once per (runtime, generation, native prompt id); a repeated hook adds none.
     * The prompt's text is never stored or logged here.
     */
    public function recordPrompt(string $sessionId, int|null $generation, string|null $promptId): void
    {
        if ($promptId === null) {
            return;
        }

        $this->commands->run(new RecordPromptTurnCommand($sessionId, $generation, $promptId));
    }
}
