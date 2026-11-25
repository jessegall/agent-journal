<?php

declare(strict_types=1);

namespace App\Events\Inboxes;

use App\Support\ActorReference;

/**
 * An actor was attached to an inbox.
 */
final readonly class InboxJoined implements InboxEvent
{
    public function __construct(public string $inboxId, public ActorReference $actor) {}
}
