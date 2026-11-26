<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\RecordPromptTurn;

use App\Support\Command;

/**
 * Records the turn a prompt of the session starts, by the driver's own prompt id, in the process generation the hook
 * call came from or else the runtime's current one. Run by the hook endpoint for the agent whose hook it answers.
 *
 * @extends Command<null>
 */
final readonly class RecordPromptTurnCommand extends Command
{
    public function __construct(
        public string $sessionId,
        public int|null $processGeneration,
        public string $nativePromptId,
    ) {}
}
