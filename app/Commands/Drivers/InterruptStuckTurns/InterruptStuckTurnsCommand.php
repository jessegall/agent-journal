<?php

declare(strict_types=1);

namespace App\Commands\Drivers\InterruptStuckTurns;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Interrupts every turn that has run longer than the journal lets a turn run; the engine runs it on each pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class InterruptStuckTurnsCommand extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'agents.stuck-turns';
}
