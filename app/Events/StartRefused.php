<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use DateTimeImmutable;

/**
 * The host's claim of a start was refused for good, such as a driver build that cannot start in a container; the
 * agent's page rereads it and shows the refusal in place of Working.
 */
final readonly class StartRefused extends SessionEvent implements UserInterfaceUpdater
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $refusal,
        public DateTimeImmutable $occurredAt,
    ) {}
}
