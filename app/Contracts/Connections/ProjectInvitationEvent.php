<?php

declare(strict_types=1);

namespace App\Contracts\Connections;

use App\Contracts\Events\Event;
use DateTimeImmutable;

/**
 * An invitation to connect a project issued, revoked or spent.
 */
interface ProjectInvitationEvent extends Event
{
    public string $invitationId { get; }

    public DateTimeImmutable $occurredAt { get; }
}
