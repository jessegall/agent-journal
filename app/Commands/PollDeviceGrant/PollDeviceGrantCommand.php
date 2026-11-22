<?php

declare(strict_types=1);

namespace App\Commands\PollDeviceGrant;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\DevicePollOutcome;

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
