<?php

declare(strict_types=1);

namespace App\Projects\Commands\PollDeviceGrant;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Projects\Values\DevicePollOutcome;
use App\Support\Command;

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
