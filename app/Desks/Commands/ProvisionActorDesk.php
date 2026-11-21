<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Gives an actor admitted outside a request, such as the installation's owner, its personal desk, run as the journal.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ProvisionActorDesk extends Command
{
    public function __construct(
        public ActorIdentity $actor,
        public string $label,
    ) {}
}
