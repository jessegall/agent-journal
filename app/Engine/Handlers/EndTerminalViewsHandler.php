<?php

declare(strict_types=1);

namespace App\Engine\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Agents\Models\TerminalView;
use App\Contracts\CommandHandler;
use App\Engine\Commands\EndTerminalViews;
use App\Engine\Support\EngineAccess;

/**
 * Ends lapsed views and views of stopped runtimes, one bulk update each, only under the engine's grant, and deletes
 * views that ended more than a day ago; the hosts' watched lists follow by themselves.
 */
final readonly class EndTerminalViewsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private ServerClock $clock,
    ) {}

    public function handle(EndTerminalViews $command): void
    {
        $this->access->assertMaintenanceGranted(EndTerminalViews::MAINTENANCE_SCOPE);
        $now = $this->clock->now();

        TerminalView::endLapsed($now);
        TerminalView::endOfStoppedRuntimes($now);
        TerminalView::pruneEndedBefore($now->subHours(TerminalView::KEEP_ENDED_HOURS));
    }
}
