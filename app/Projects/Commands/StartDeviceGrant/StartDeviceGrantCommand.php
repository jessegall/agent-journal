<?php

declare(strict_types=1);

namespace App\Projects\Commands\StartDeviceGrant;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Projects\Values\DeviceGrantStart;
use App\Support\Command;

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
