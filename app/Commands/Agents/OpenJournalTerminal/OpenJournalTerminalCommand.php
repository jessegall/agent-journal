<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenJournalTerminal;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Opens the terminal of a Claude Code runtime the journal drives itself, once its build and sign-in are proven and
 * while none of it runs; its driver worker then types each prompt into it. Answers the terminal's process id; none
 * when nothing opens. Run when the start is proven (internal, not exported).
 *
 * @extends Command<string|null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenJournalTerminalCommand extends Command
{
    public function __construct(public string $runtimeId) {}
}
