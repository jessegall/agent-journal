<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\TerminalGrantEvent;

/**
 * A terminal grant was retired by a release request.
 */
final readonly class TerminalGrantRetired extends SessionEvent implements TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
        public string $requestId,
    ) {}
}
