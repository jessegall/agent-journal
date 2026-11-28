<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveSessionNetwork;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Instructs a contained host to remove a session's own network from the agent daemon, so an ended or failed start
 * leaves no network behind. Answers the instruction's id (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RemoveSessionNetworkCommand extends Command
{
    public function __construct(public string $hostId, public string $sessionId) {}
}
