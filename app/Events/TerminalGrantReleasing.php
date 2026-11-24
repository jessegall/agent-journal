<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\TerminalGrantEvent;

/**
 * A terminal grant is being released through a driver request.
 */
final readonly class TerminalGrantReleasing extends SessionEvent implements TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
        public string $requestId,
    ) {}
}
