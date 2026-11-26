<?php

declare(strict_types=1);

namespace App\Projects\Commands\StartProjectCommandRun;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Projects\Values\CommandRunStart;
use App\Support\Command;

/**
 * Records that a connected machine's journal verb starts under its request id, with the operation's fingerprint and
 * the worker that runs it, or answers the run that request id already started, so a repeat never runs the verb twice.
 *
 * @extends Command<CommandRunStart>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class StartProjectCommandRunCommand extends Command
{
    /**
     * @param  list<string>  $argv
     */
    public function __construct(
        public string $requestKey,
        public string $agentId,
        public string $bindingId,
        public array $argv,
        public string $fingerprint,
        public string $worker,
    ) {}
}
