<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RequestHostProtection;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Brings a contained host's protection reports up to date: each driver family's report on each container platform the
 * host has none of is judged, and where Claude Code's sandbox has not been probed in the agent image yet, the first
 * isolation probe is opened instead. Run by the journal on each claim of a contained host (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RequestHostProtectionCommand extends Command
{
    public function __construct(public string $hostId) {}
}
