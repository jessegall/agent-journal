<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Contracts\Drivers\TurnResult;
use App\Contracts\Drivers\TurnResults;

/**
 * Reads what one headless Claude Code turn prints.
 */
final readonly class ClaudeCodeTurnResults implements TurnResults
{
    /**
     * The reader of the turn of the process.
     */
    public function __invoke(string $processId): TurnResult
    {
        return new ClaudeResult($processId);
    }
}
