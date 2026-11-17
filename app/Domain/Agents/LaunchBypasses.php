<?php

declare(strict_types=1);

namespace App\Domain\Agents;

use App\Domain\Agents\Models\LaunchBypass;

/**
 * Keeps the bypasses a launch's host reports after the journal came back; they are facts, never fresh permission.
 */
final readonly class LaunchBypasses
{
    public function record(int $sessionId, BypassReport $report): void
    {
        LaunchBypass::recordAll($sessionId, $report);
    }
}
