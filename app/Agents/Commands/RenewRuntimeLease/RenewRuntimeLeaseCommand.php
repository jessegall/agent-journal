<?php

declare(strict_types=1);

namespace App\Agents\Commands\RenewRuntimeLease;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Values\RuntimeLease;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * A binding's relay renews one runtime's execution lease, apart from its presence and the runtime heartbeat; only
 * the binding's own host, in the binding's current authority generation, for a runtime of that host in the
 * binding's root.
 *
 * @extends Command<RuntimeLease>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RenewRuntimeLeaseCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $bindingId,
        public string $runtimeId,
        public int $authorityGeneration,
        public int $runtimeGeneration,
    ) {}
}
