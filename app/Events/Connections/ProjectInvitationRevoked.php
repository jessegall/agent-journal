<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectInvitationEvent;
use DateTimeImmutable;

/**
 * An install line was revoked before anyone redeemed it.
 */
final readonly class ProjectInvitationRevoked implements ConnectionEvent, ProjectInvitationEvent
{
    public function __construct(
        public string $invitationId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
