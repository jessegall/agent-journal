<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\HandOverInbox;

use App\Support\ActorIdentity;
use App\Support\Command;

/**
 * Hands the inbox from one actor to another: the new actor joins and the old one leaves.
 *
 * @extends Command<null>
 */
final readonly class HandOverInboxCommand extends Command
{
    public function __construct(public string $inboxId, public ActorIdentity $from, public ActorIdentity $to) {}
}
