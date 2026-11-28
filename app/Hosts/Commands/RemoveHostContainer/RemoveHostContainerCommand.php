<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostContainer;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Instructs the host to remove the container of that name from its agent daemon, stopping it first. Answers the
 * instruction's id (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RemoveHostContainerCommand extends Command
{
    public function __construct(public string $hostId, public string $container) {}
}
