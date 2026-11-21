<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A shell of a connected machine asks for a device grant for its binding; only the binding's own host may.
 *
 * @extends Command<\App\Connections\Values\DeviceGrantStart>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class StartDeviceGrant extends Command
{
    public function __construct(public string $hostId, public string $bindingId, public string $deviceCodeDigest, public string $userCode) {}
}
