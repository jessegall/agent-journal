<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Handlers\ReportRuntimeActivityHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Records what a host saw a runtime do: its activity and hold in a process generation. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<null>
 */
#[HandledBy(ReportRuntimeActivityHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ReportRuntimeActivity implements Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public RuntimeActivity $activity,
        public HoldReason $hold,
        public int $processGeneration,
    ) {}
}
