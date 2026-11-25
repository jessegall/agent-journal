<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * A terminal grant's take was sent to the host as a driver request.
 */
final readonly class TerminalTakeSent implements SessionEvent
{
    public function __construct(
        public string $grantId,
        public string $requestId,
    ) {}
}
