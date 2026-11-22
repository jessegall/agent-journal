<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;

/**
 * The owner issued an install line. It carries the invitation and when it expires, never the ticket.
 */
final readonly class ProjectInvitationIssued implements Event
{
    public function __construct(
        public string $invitationId,
        public DateTimeImmutable $expiresAt,
        public DateTimeImmutable $occurredAt,
    ) {}
}
