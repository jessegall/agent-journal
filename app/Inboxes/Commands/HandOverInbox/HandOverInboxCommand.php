<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\HandOverInbox;

use App\Support\ActorReference;
use App\Support\Command;

/**
 * Hands the inbox from one actor to another: the new actor joins and the old one leaves.
 *
 * @extends Command<null>
 */
final readonly class HandOverInboxCommand extends Command
{
    public function __construct(public string $inboxId, public ActorReference $from, public ActorReference $to) {}
}
