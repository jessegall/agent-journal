<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ReportRuntimeHeartbeatHandler;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Records a host's liveness evidence for a runtime as its session's heartbeat. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[HandledBy(ReportRuntimeHeartbeatHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRuntimeHeartbeat extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
