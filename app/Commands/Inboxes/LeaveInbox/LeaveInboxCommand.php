<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\LeaveInbox;

use App\Support\ActorIdentity;
use App\Support\Command;

/**
 * Detaches the actor from the inbox.
 *
 * @extends Command<null>
 */
final readonly class LeaveInboxCommand extends Command
{
    public function __construct(public string $inboxId, public ActorIdentity $actor) {}
}
