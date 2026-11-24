<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\ProjectInvitationEvent;
use DateTimeImmutable;

/**
 * An install line was redeemed once, for the binding it made.
 */
final readonly class ProjectInvitationSpent extends ConnectionEvent implements ProjectInvitationEvent
{
    public function __construct(
        public string $invitationId,
        public string $bindingId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
