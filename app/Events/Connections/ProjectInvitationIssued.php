<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectInvitationEvent;
use DateTimeImmutable;

/**
 * The owner issued an install line. It carries the invitation and when it expires, never the ticket.
 */
final readonly class ProjectInvitationIssued implements ConnectionEvent, ProjectInvitationEvent
{
    public function __construct(
        public string $invitationId,
        public DateTimeImmutable $expiresAt,
        public DateTimeImmutable $occurredAt,
    ) {}
}
