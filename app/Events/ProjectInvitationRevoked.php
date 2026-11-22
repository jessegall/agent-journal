<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use DateTimeImmutable;

/**
 * An install line was revoked before anyone redeemed it.
 */
final readonly class ProjectInvitationRevoked implements Event
{
    public function __construct(
        public string $invitationId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
