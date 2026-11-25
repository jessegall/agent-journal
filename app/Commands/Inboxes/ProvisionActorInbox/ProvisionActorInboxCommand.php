<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\ProvisionActorInbox;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\ActorIdentity;
use App\Support\Command;

/**
 * Gives an actor admitted outside a request, such as the installation's owner, its personal inbox, run as the journal.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ProvisionActorInboxCommand extends Command
{
    public function __construct(
        public ActorIdentity $actor,
        public string $label,
    ) {}
}
