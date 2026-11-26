<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\ProvisionActorInbox;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\ActorReference;
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
        public ActorReference $actor,
        public string $label,
    ) {}
}
