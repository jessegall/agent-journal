<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveSessionContainer;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Instructs a contained host to remove what an ended session left on the agent daemon besides its containers: its own
 * network and its folder of plan files. Answers the instruction's id (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RemoveSessionContainerCommand extends Command
{
    public function __construct(public string $hostId, public string $sessionId) {}
}
