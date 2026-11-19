<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;
use App\Desks\Handlers\ProvisionActorDeskHandler;

/**
 * Gives an actor admitted outside a request, such as the installation's owner, its personal desk, run as the journal.
 *
 * @implements Command<null>
 */
#[HandledBy(ProvisionActorDeskHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ProvisionActorDesk implements Command
{
    public function __construct(
        public ActorIdentity $actor,
        public string $label,
    ) {}
}
