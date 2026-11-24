<?php

declare(strict_types=1);

namespace App\Events\Inboxes;

use App\Support\ActorIdentity;

/**
 * An actor was attached to an inbox.
 */
final readonly class InboxJoined extends InboxEvent
{
    public function __construct(public string $inboxId, public ActorIdentity $actor) {}
}
