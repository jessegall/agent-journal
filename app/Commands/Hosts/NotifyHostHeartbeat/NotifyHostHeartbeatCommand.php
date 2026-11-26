<?php

declare(strict_types=1);

namespace App\Commands\Hosts\NotifyHostHeartbeat;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A host says it is alive, with the processes it still runs and the newest order it answered. Run by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyHostHeartbeatCommand extends Command
{
    /**
     * @param  list<string>  $liveProcesses
     */
    public function __construct(
        public string $hostId,
        public array $liveProcesses,
        public string|null $answeredThrough,
    ) {}
}
