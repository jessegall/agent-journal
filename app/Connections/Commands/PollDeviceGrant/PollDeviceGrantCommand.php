<?php

declare(strict_types=1);

namespace App\Connections\Commands\PollDeviceGrant;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Connections\Values\DevicePollOutcome;

/**
 * The shell asks whether the owner approved its device code; once approved the grant is issued under the digest
 * of the grant the shell receives.
 *
 * @extends Command<DevicePollOutcome>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class PollDeviceGrantCommand extends Command
{
    public function __construct(public string $hostId, public string $deviceCodeDigest, public string $grantDigest) {}
}
