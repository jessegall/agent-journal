<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\EngineTargetAccess;
use App\Access\Contracts\MaintenanceAdmission;
use App\Console\Commands\TickCommand;
use App\Engine\AdvisoryEngineLock;
use App\Engine\EngineAccess;
use App\Engine\EngineListenerSet;
use App\Engine\EngineLoop;
use App\Engine\EngineSettings;
use App\Engine\EngineTickedDelivery;
use App\Engine\FrameBaselines;
use App\Engine\TickCandidates;
use App\Engine\TickDelivery;
use App\Engine\TickOrigins;
use App\Engine\Watchdog;
use App\Navigation\ExpireNavigationRequestsOnTick;
use App\Processes\Contracts\StopTimes as StopTimesContract;
use App\Processes\Contracts\Watchdog as WatchdogContract;
use App\Reads\SelfMeasuredCommands;
use App\Sessions\EnforceSessionStartLimitsOnTick;
use App\Sessions\InterruptStuckTurnsOnTick;
use App\Sessions\MarkSilentSessionsOnTick;
use App\Support\CertifyPassedStopsOnTick;
use App\Terminals\EndTerminalViewsOnTick;
use App\Time\Contracts\MonotonicClock as MonotonicClockContract;
use App\Time\Contracts\Sleeper as SleeperContract;
use App\Time\MonotonicClock;
use App\Time\Sleeper;
use App\Time\StopTimes;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * The engine's settings, read once from config/engine.php, its one lock for the life of the process, and what it may
 * address in the current operation; areas add their engine listeners to EngineListenerSet, and the engine adds the
 * start silence sweep.
 */
final class EngineServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(EngineSettings::class, fn (Application $app) => new EngineSettings(
            $app->make('config')->string('engine.connection'),
            $app->make('config')->integer('engine.lock_key'),
            $app->make('config')->integer('engine.pass_budget_ms'),
            $app->make('config')->integer('engine.command_budget_ms'),
            $app->make('config')->integer('engine.batch_size'),
            $app->make('config')->integer('engine.watchdog_seconds'),
        ));

        $this->app->singleton(AdvisoryEngineLock::class);
        $this->app->scoped(EngineAccess::class);
        $this->app->scoped(TickOrigins::class);
        $this->app->bind(EngineTargetAccess::class, fn (Application $app) => $app->make(EngineAccess::class));
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(MaintenanceAdmission::class, fn (Application $app) => $app->make(EngineAccess::class));
        $this->app->singleton(MonotonicClockContract::class, MonotonicClock::class);
        $this->app->bind(StopTimesContract::class, StopTimes::class);
        $this->app->singleton(EngineListenerSet::class);
        $this->app->scoped(EngineTickedDelivery::class);
        $this->app->singleton(SleeperContract::class, Sleeper::class);
        $this->app->singleton(WatchdogContract::class, Watchdog::class);
        $this->app->singleton(EngineLoop::class);
        $this->app->singleton(TickCandidates::class);
        $this->app->singleton(FrameBaselines::class);
        $this->app->scoped(TickDelivery::class);
    }

    public function boot(
        SelfMeasuredCommands $selfMeasured,
        EngineListenerSet $listeners,
    ): void {
        $listeners->add(MarkSilentSessionsOnTick::class);
        $listeners->add(CertifyPassedStopsOnTick::class);
        $listeners->add(EndTerminalViewsOnTick::class);
        $listeners->add(ExpireNavigationRequestsOnTick::class);
        $listeners->add(InterruptStuckTurnsOnTick::class);
        $listeners->add(EnforceSessionStartLimitsOnTick::class);
        $selfMeasured->add('engine:tick');
        $this->commands([TickCommand::class]);
    }
}
