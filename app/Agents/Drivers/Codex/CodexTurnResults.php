<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Contracts\Drivers\TurnResult;
use App\Contracts\Drivers\TurnResults;

/**
 * Reads what one codex exec turn prints.
 */
final readonly class CodexTurnResults implements TurnResults
{
    /**
     * The reader of the turn of the process.
     */
    public function __invoke(string $processId): TurnResult
    {
        return new CodexResult($processId);
    }
}
