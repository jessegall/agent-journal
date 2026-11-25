<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\TerminalGrantEvent;

/**
 * A terminal grant's lifetime was renewed.
 */
final readonly class TerminalGrantRenewed implements SessionEvent, TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
