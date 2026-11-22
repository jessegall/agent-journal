<?php

declare(strict_types=1);

namespace App\Commands\StartDeviceGrant;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\DeviceGrantStart;

/**
 * A shell of a connected machine asks for a device grant for its binding; only the binding's own host may. Asked
 * again under the same start key, it finds the grant the first ask made.
 *
 * @extends Command<DeviceGrantStart>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class StartDeviceGrantCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $bindingId,
        public string $deviceCodeDigest,
        public string $userCode,
        public string $startKey,
    ) {}
}
