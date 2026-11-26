<?php

declare(strict_types=1);

namespace App\Commands\Drivers\RecordPromptTurn;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverTurn;

/**
 * Records a prompt's turn once per runtime, generation and native prompt id; a session without a runtime records none.
 */
final readonly class RecordPromptTurnHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(RecordPromptTurnCommand $command): void
    {
        $runtime = AgentRuntime::findForSession($command->sessionId);

        if ($runtime === null) {
            return;
        }

        DriverTurn::create(
            $runtime->id,
            $command->processGeneration ?? $runtime->process_generation,
            $command->nativePromptId,
            $this->clock->now(),
        );
    }
}
