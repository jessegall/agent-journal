<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Models\StartBypass;
use App\Agents\Support\BypassReport;

/**
 * Keeps the bypasses a start's host reports after the journal came back; they are facts, never fresh permission.
 */
final readonly class StartBypasses
{
    public function record(string $sessionId, BypassReport $report): void
    {
        StartBypass::recordAll($sessionId, $report);
    }
}
