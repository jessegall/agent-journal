<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\OpenHeadlessTurn;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Opens the next turn of a headless Claude Code runtime: its oldest waiting delivery or wake runs as one process with
 * the prompt in its argv, once the build is proven and no turn is live; it answers the process id, or none. Run when
 * work is accepted, the build is proven or a turn ends.
 *
 * @extends Command<string|null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenHeadlessTurnCommand extends Command
{
    public function __construct(public string $runtimeId) {}
}
