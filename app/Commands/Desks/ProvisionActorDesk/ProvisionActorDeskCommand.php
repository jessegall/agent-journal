<?php

declare(strict_types=1);

namespace App\Commands\Desks\ProvisionActorDesk;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\ActorIdentity;
use App\Support\Command;

/**
 * Gives an actor admitted outside a request, such as the installation's owner, its personal desk, run as the journal.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ProvisionActorDeskCommand extends Command
{
    public function __construct(
        public ActorIdentity $actor,
        public string $label,
    ) {}
}
