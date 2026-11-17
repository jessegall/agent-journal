<?php

declare(strict_types=1);

namespace App\Core\Agents\Actions;

use App\Core\Agents\Models\LaunchBypass;
use App\Core\Agents\Support\BypassReport;

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
