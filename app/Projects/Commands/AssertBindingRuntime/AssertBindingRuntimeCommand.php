<?php

declare(strict_types=1);

namespace App\Projects\Commands\AssertBindingRuntime;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Refuses a binding's start before any grant unless the calling host is the binding's own, the root id and the
 * folder are the binding's registered root, the agent is its main agent and the driver is one it may start.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class AssertBindingRuntimeCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $bindingId,
        public string $rootId,
        public string $folder,
        public string $agentId,
        public string $driver,
    ) {}
}
