<?php

declare(strict_types=1);

namespace App\Commands\NotifyRuntimeHeartbeat;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Records a host's liveness evidence for a runtime as its session's heartbeat. Run for an authenticated host by the
 * journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyRuntimeHeartbeatCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
