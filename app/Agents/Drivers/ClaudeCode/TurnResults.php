<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\TurnResult as TurnResultContract;
use App\Agents\Drivers\Contracts\TurnResults as TurnResultsContract;

/**
 * Reads what one headless Claude Code turn prints.
 */
final readonly class TurnResults implements TurnResultsContract
{
    /**
     * The reader of the turn of the process.
     */
    public function __invoke(string $processId): TurnResultContract
    {
        return new TurnResult($processId);
    }
}
