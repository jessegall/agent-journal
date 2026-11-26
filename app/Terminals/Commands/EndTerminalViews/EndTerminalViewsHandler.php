<?php

declare(strict_types=1);

namespace App\Terminals\Commands\EndTerminalViews;

use App\Bus\Contracts\CommandHandler;
use App\Engine\EngineAccess;
use App\Models\Drivers\TerminalView;
use App\Time\Contracts\ServerClock;
use Carbon\CarbonImmutable;

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

    public function handle(EndTerminalViewsCommand $command): void
    {
        $this->access->assertMaintenanceGranted(EndTerminalViewsCommand::MAINTENANCE_SCOPE);
        $now = $this->clock->now();

        $this->endLapsed($now);
        $this->endForStoppedRuntimes($now);
        $this->pruneEndedBefore($now->subHours(TerminalView::KEEP_ENDED_HOURS));
    }

    /**
     * Ends every view whose lease ran out unrenewed, in one update.
     */
    private function endLapsed(CarbonImmutable $now): void
    {
        TerminalView::query()->acrossActors()->lapsed($now)->update(['closed_at' => $now]);
    }

    /**
     * Ends every live view of a runtime that stopped, in one update.
     */
    private function endForStoppedRuntimes(CarbonImmutable $now): void
    {
        TerminalView::query()->acrossActors()->live()->ofStoppedRuntime()->update(['closed_at' => $now]);
    }

    /**
     * Deletes the views that ended or lapsed before the cutoff, in one statement.
     */
    private function pruneEndedBefore(CarbonImmutable $cutoff): void
    {
        TerminalView::query()
            ->acrossActors()
            ->endedBefore($cutoff)
            ->delete();
    }
}
