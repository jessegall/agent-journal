<?php

declare(strict_types=1);

namespace App\Commands\Hosts\RemoveHostProcess;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Orders the host to remove the container an ended process ran in, so no ended container is left on the agent
 * daemon. Answers the order's id (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RemoveHostProcessCommand extends Command
{
    public function __construct(public string $processId) {}
}
