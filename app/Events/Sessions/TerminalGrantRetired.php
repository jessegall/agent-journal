<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\TerminalGrantEvent;

/**
 * A terminal grant was retired by a release request.
 */
final readonly class TerminalGrantRetired implements SessionEvent, TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
        public string $requestId,
    ) {}
}
