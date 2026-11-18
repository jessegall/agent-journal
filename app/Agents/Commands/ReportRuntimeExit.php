<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Handlers\ReportRuntimeExitHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Ends a runtime's session on the host's verified report that its program exited. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<void>
 */
#[HandledBy(ReportRuntimeExitHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ReportRuntimeExit implements Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
