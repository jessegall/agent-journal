<?php

declare(strict_types=1);

namespace App\Engine\Providers;

use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\MaintenanceAdmission;
use App\Bus\Contracts\StopTimes;
use App\Engine\Console\TickCommand;
use App\Engine\Contracts\MonotonicClock;
use App\Engine\Contracts\Sleeper;
use App\Engine\Contracts\Watchdog;
use App\Engine\Support\AdvisoryEngineLock;
use App\Engine\Support\AlarmWatchdog;
use App\Engine\Support\CertifyPassedStopsOnTick;
use App\Engine\Support\EndTerminalViewsOnTick;
use App\Engine\Support\EnforceLaunchLimitsOnTick;
use App\Engine\Support\EngineAccess;
use App\Engine\Support\EngineAuthorizerProvider;
use App\Engine\Support\EngineListenerSet;
use App\Engine\Support\EngineLoop;
use App\Engine\Support\EngineSettings;
use App\Engine\Support\EngineTickedDelivery;
use App\Engine\Support\ExpireNavigationRequestsOnTick;
use App\Engine\Support\FrameBaselines;
use App\Engine\Support\InspectMergeAttemptsOnTick;
use App\Engine\Support\MarkSilentSessionsOnTick;
use App\Engine\Support\MonotonicStopTimes;
use App\Engine\Support\SystemMonotonicClock;
use App\Engine\Support\SystemSleeper;
use App\Engine\Support\TickCandidates;
use App\Engine\Support\TickDelivery;
use App\Engine\Support\TickOrigins;
use App\Hooks\Contracts\EngineTargetAccess;
use App\Reads\Support\SelfMeasuredCommands;
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
