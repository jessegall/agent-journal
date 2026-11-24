<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\TerminalGrantEvent;

/**
 * A terminal grant's release was confirmed.
 */
final readonly class TerminalGrantReleased extends SessionEvent implements TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
