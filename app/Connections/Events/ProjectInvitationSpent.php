<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;

/**
 * An install line was redeemed once, for the binding it made.
 */
final readonly class ProjectInvitationSpent implements Event
{
    public function __construct(
        public string $invitationId,
        public string $bindingId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
