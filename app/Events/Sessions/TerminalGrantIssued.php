<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\TerminalGrantEvent;

/**
 * A terminal grant was granted by the host.
 */
final readonly class TerminalGrantIssued implements SessionEvent, TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
