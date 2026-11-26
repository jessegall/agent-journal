<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenHeadlessTurn;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Opens the next turn of a headless Claude Code runtime the journal drives itself: its oldest waiting delivery or wake
 * runs as one process with the prompt in its argv, once the runtime's build is proven and while no turn of it is
 * live. Answers the turn's process id; none when nothing opens. Run when work is accepted, when the build is proven
 * and when a turn ends (internal, not exported).
 *
 * @extends Command<string|null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenHeadlessTurnCommand extends Command
{
    public function __construct(public string $runtimeId) {}
}
