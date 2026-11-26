<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\TerminalGrantEvent;

/**
 * A terminal grant was refused.
 */
final readonly class TerminalGrantRefused implements SessionEvent, TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
