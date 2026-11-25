<?php

declare(strict_types=1);

namespace App\Providers;

use App\Console\Commands\TickCommand;
use App\Contracts\Admission\MaintenanceAdmission;
use App\Contracts\Authorization\EngineTargetAccess;
use App\Contracts\Processes\StopTimes as StopTimesContract;
use App\Contracts\Processes\Watchdog as WatchdogContract;
use App\Contracts\Time\MonotonicClock as MonotonicClockContract;
use App\Contracts\Time\Sleeper as SleeperContract;
use App\Support\AdvisoryEngineLock;
use App\Support\CertifyPassedStopsOnTick;
use App\Support\EndTerminalViewsOnTick;
use App\Support\EnforceSessionStartLimitsOnTick;
use App\Support\EngineAccess;
use App\Support\EngineListenerSet;
use App\Support\EngineLoop;
use App\Support\EngineSettings;
use App\Support\EngineTickedDelivery;
use App\Support\ExpireNavigationRequestsOnTick;
use App\Support\FrameBaselines;
use App\Support\InterruptStuckTurnsOnTick;
use App\Support\MarkSilentSessionsOnTick;
use App\Support\MonotonicClock;
use App\Support\SelfMeasuredCommands;
use App\Support\Sleeper;
use App\Support\StopTimes;
use App\Support\TickCandidates;
use App\Support\TickDelivery;
use App\Support\TickOrigins;
use App\Support\Watchdog;
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
