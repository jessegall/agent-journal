<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Models\LaunchBypass;
use App\Agents\Support\BypassReport;

/**
 * Keeps the bypasses a launch's host reports after the journal came back; they are facts, never fresh permission.
 */
final readonly class LaunchBypasses
{
    public function record(string $sessionId, BypassReport $report): void
    {
        LaunchBypass::recordAll($sessionId, $report);
    }
}
