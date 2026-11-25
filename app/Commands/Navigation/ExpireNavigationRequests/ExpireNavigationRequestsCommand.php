<?php

declare(strict_types=1);

namespace App\Commands\Navigation\ExpireNavigationRequests;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Expires every navigation request nobody answered in time; the engine runs it on each pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class ExpireNavigationRequestsCommand extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'agents.navigation';
}
