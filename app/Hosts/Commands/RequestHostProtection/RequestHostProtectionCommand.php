<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RequestHostProtection;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Brings a contained host's protection reports up to date: each driver family's report on each container platform the
 * host has none of is judged. Run by the journal on each claim of a contained host (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RequestHostProtectionCommand extends Command
{
    public function __construct(public string $hostId) {}
}
