<?php

declare(strict_types=1);

namespace App\Engine\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Engine\Handlers\ExpireNavigationRequestsHandler;

/**
 * Expires every navigation request nobody answered in time; the engine runs it on each pass.
 *
 * @extends Command<null>
 */
#[HandledBy(ExpireNavigationRequestsHandler::class)]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class ExpireNavigationRequests extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'agents.navigation';
}
