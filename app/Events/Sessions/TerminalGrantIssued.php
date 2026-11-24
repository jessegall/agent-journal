<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\TerminalGrantEvent;

/**
 * A terminal grant was granted by the host.
 */
final readonly class TerminalGrantIssued extends SessionEvent implements TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
