<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Drivers\Enums\HookDriver;

/**
 * Refuses a binding's start before any grant unless the calling host is the binding's own, the root id and the
 * folder are the binding's registered root, the agent is its main agent and the driver is one it may start.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class AssertBindingStart extends Command
{
    public function __construct(
        public string $hostId,
        public string $bindingId,
        public string $rootId,
        public string $folder,
        public string $agentId,
        public HookDriver $driver,
    ) {}
}
