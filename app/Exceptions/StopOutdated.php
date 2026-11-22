<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\StaleRefusal;
use RuntimeException;

/**
 * A stop written for a session or process generation the agent no longer runs; nothing is stopped, so the caller
 * reads the agent's status again before it stops what runs now.
 */
final class StopOutdated extends RuntimeException implements StaleRefusal
{
    public static function forSession(string $sessionId, int $expected, int $current): self
    {
        return new self(
            "Session {$sessionId} now runs process generation {$current}, not {$expected}; check its status first.",
        );
    }

    public function staleCode(): string
    {
        return 'stale-generation';
    }
}
