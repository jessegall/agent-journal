<?php

declare(strict_types=1);

namespace App\Commands\Terminals\EndTerminalViews;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Enums\RuntimeActivity;
use App\Models\Drivers\TerminalView;
use App\Support\EngineAccess;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

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
        TerminalView::query()->acrossActors()->live()->whereHas(
            'runtime',
            fn (Builder $runtime) => $runtime->where('activity', RuntimeActivity::Stopped),
        )->update(['closed_at' => $now]);
    }

    /**
     * Deletes the views that ended or lapsed before the cutoff, in one statement.
     */
    private function pruneEndedBefore(CarbonImmutable $cutoff): void
    {
        TerminalView::query()
            ->acrossActors()
            ->where(fn (Builder $ended) => $ended
                ->where('closed_at', '<', $cutoff)
                ->orWhere('expires_at', '<', $cutoff))
            ->delete();
    }
}
