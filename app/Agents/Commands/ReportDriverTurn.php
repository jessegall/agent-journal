<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ReportDriverTurnHandler;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Enums\CommandEntry;

/**
 * Records a native turn a host saw start or finish, by the program's own prompt id, with its settings. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[HandledBy(ReportDriverTurnHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ReportDriverTurn extends Command
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
