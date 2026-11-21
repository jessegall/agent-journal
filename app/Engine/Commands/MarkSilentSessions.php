<?php

declare(strict_types=1);

namespace App\Engine\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Marks silent every session whose beats stopped for a presence window; the engine runs it on each pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class MarkSilentSessions extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'agents.silence';
}
