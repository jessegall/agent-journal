<?php

declare(strict_types=1);

namespace App\Commands\NotifyDriverTurn;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Records a native turn a host saw start or finish, by the driver's own prompt id, with its settings. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyDriverTurnCommand extends Command
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
