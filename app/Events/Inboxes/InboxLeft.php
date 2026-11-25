<?php

declare(strict_types=1);

namespace App\Events\Inboxes;

use App\Support\ActorIdentity;

/**
 * An actor was detached from an inbox.
 */
final readonly class InboxLeft implements InboxEvent
{
    public function __construct(public string $inboxId, public ActorIdentity $actor) {}
}
