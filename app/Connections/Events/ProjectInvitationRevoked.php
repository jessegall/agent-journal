<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * An install line was revoked before anyone redeemed it.
 */
final readonly class ProjectInvitationRevoked implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $invitationId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
