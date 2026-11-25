<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\JoinInbox;

use App\Support\ActorReference;
use App\Support\Command;

/**
 * Attaches the actor to the inbox.
 *
 * @extends Command<null>
 */
final readonly class JoinInboxCommand extends Command
{
    public function __construct(public string $inboxId, public ActorReference $actor) {}
}
