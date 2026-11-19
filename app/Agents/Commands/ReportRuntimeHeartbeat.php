<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ReportRuntimeHeartbeatHandler;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;

/**
 * Records a host's liveness evidence for a runtime as its session's heartbeat. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<void>
 */
#[HandledBy(ReportRuntimeHeartbeatHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRuntimeHeartbeat implements Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
