<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * The read interest a viewer holds in a runtime's terminal: which, the id the opening view addresses it by, how often
 * it refreshes, how long it stays live unrenewed and whether it is live at all, as a retried open of an ended one
 * answers.
 */
final readonly class TerminalViewReceipt
{
    public function __construct(
        public string $viewId,
        public string $readInterestId,
        public string $runtimeId,
        public int $intervalMs,
        public int $expiresInSeconds,
        public bool $live,
    ) {}
}
