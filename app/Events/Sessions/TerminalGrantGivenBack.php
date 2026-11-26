<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\TerminalGrantEvent;

/**
 * A terminal grant is being released through a driver request.
 */
final readonly class TerminalGrantGivenBack implements SessionEvent, TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
        public string $requestId,
    ) {}
}
