<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * One runtime somebody watches, and how often its host captures the screen for it.
 */
final readonly class WatchedRuntime
{
    public function __construct(
        public string $runtimeId,
        public int $intervalMs,
    ) {}
}
