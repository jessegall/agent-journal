<?php

declare(strict_types=1);

namespace App\Commands\Hosts\OpenHostProcess;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;

/**
 * Makes a process on a host and the order that opens it, a container or a native process as its plan says, for the
 * runtime it runs when it runs one. Run by the journal itself (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class OpenHostProcessCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string|null $runtimeId,
        public HostProcessPlan $plan,
        public HostOrderSource $source,
        /**
         * The journal's start record the process runs for; none for a process no start made
         */
        public string|null $sessionProcessId = null,
    ) {}
}
