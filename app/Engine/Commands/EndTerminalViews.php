<?php

declare(strict_types=1);

namespace App\Engine\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Ends every terminal view that lapsed unrenewed or whose runtime stopped, and deletes those ended a day ago; the
 * engine runs it on each pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class EndTerminalViews extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'agents.terminal-views';
}
