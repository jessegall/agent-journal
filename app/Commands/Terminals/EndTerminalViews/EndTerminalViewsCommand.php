<?php

declare(strict_types=1);

namespace App\Commands\Terminals\EndTerminalViews;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Ends every terminal view that lapsed unrenewed or whose runtime stopped, and deletes those ended a day ago; the
 * engine runs it on each pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class EndTerminalViewsCommand extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'agents.terminal-views';
}
