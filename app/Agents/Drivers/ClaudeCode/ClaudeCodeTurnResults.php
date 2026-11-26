<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\TurnResult;
use App\Agents\Drivers\Contracts\TurnResults;

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
