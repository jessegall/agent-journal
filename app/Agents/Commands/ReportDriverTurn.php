<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Handlers\ReportDriverTurnHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Records a native turn a host saw start or finish, by the program's own prompt id, with its settings. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<null>
 */
#[HandledBy(ReportDriverTurnHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ReportDriverTurn implements Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public int $processGeneration,
        public string $nativePromptId,
        public bool $finished,
        public string|null $model,
        public string|null $effort,
        public string|null $outcome,
    ) {}
}
