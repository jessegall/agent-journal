<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * The view a viewer holds on a runtime's terminal: which, how often it refreshes and how long it stays live unrenewed.
 */
final readonly class TerminalViewReceipt
{
    public function __construct(
        public string $viewId,
        public string $runtimeId,
        public int $intervalMs,
        public int $expiresInSeconds,
    ) {}
}
