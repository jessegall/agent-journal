<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Handlers\ReportRuntimeHeartbeatHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Records a host's liveness evidence for a runtime as its session's heartbeat. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<void>
 */
#[HandledBy(ReportRuntimeHeartbeatHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ReportRuntimeHeartbeat implements Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
