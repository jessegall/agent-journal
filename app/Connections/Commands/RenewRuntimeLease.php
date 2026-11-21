<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Connections\Values\RuntimeLease;

/**
 * A binding's relay renews one runtime's execution lease, apart from its presence and the runtime heartbeat; only
 * the binding's own host, in the binding's current authority generation, for a runtime of that host in the
 * binding's root.
 *
 * @extends Command<RuntimeLease>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RenewRuntimeLease extends Command
{
    public function __construct(
        public string $hostId,
        public string $bindingId,
        public string $runtimeId,
        public int $authorityGeneration,
        public int $runtimeGeneration,
    ) {}
}
