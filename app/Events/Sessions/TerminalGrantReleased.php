<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\TerminalGrantEvent;

/**
 * A terminal grant's release was confirmed.
 */
final readonly class TerminalGrantReleased implements SessionEvent, TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
