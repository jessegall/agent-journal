<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\TurnResult;
use App\Agents\Drivers\Contracts\TurnResults;

/**
 * Reads what one `codex exec --json` turn prints.
 */
final readonly class CodexTurnResults implements TurnResults
{
    public function __invoke(string $processId): TurnResult
    {
        return new CodexTurnResult();
    }
}
