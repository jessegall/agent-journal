<?php

declare(strict_types=1);

namespace App\Providers;

use App\Console\Commands\TickCommand;
use App\Contracts\Admission\MaintenanceAdmission;
use App\Contracts\Authorization\AuthorizerProviderRegistration;
use App\Contracts\Authorization\EngineTargetAccess;
use App\Contracts\Processes\StopTimes;
use App\Contracts\Processes\Watchdog;
use App\Contracts\Time\MonotonicClock;
use App\Contracts\Time\Sleeper;
use App\Enums\ActorType;
use App\Support\AdvisoryEngineLock;
use App\Support\AlarmWatchdog;
use App\Support\CertifyPassedStopsOnTick;
use App\Support\EndTerminalViewsOnTick;
use App\Support\EnforceLaunchLimitsOnTick;
use App\Support\EngineAccess;
use App\Support\EngineAuthorizerProvider;
use App\Support\EngineListenerSet;
use App\Support\EngineLoop;
use App\Support\EngineSettings;
use App\Support\EngineTickedDelivery;
use App\Support\ExpireNavigationRequestsOnTick;
use App\Support\FrameBaselines;
use App\Support\InspectMergeAttemptsOnTick;
use App\Support\MarkSilentSessionsOnTick;
use App\Support\MonotonicStopTimes;
use App\Support\SelfMeasuredCommands;
use App\Support\SystemMonotonicClock;
use App\Support\SystemSleeper;
use App\Support\TickCandidates;
use App\Support\TickDelivery;
use App\Support\TickOrigins;
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
        $this->app->singleton(MonotonicClock::class, SystemMonotonicClock::class);
        $this->app->bind(StopTimes::class, MonotonicStopTimes::class);
        $this->app->singleton(EngineListenerSet::class);
        $this->app->scoped(EngineTickedDelivery::class);
        $this->app->singleton(Sleeper::class, SystemSleeper::class);
        $this->app->singleton(Watchdog::class, AlarmWatchdog::class);
        $this->app->singleton(EngineLoop::class);
        $this->app->singleton(TickCandidates::class);
        $this->app->singleton(FrameBaselines::class);
        $this->app->scoped(TickDelivery::class);
    }

    public function boot(
        SelfMeasuredCommands $selfMeasured,
        EngineListenerSet $listeners,
        AuthorizerProviderRegistration $authorizers,
    ): void {
        $authorizers->register(ActorType::Engine, EngineAuthorizerProvider::class);
        $listeners->add(MarkSilentSessionsOnTick::class);
        $listeners->add(CertifyPassedStopsOnTick::class);
        $listeners->add(InspectMergeAttemptsOnTick::class);
        $listeners->add(EndTerminalViewsOnTick::class);
        $listeners->add(ExpireNavigationRequestsOnTick::class);
        $listeners->add(EnforceLaunchLimitsOnTick::class);
        $selfMeasured->add('engine:tick');
        $this->commands([TickCommand::class]);
    }
}
