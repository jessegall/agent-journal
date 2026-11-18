<?php

declare(strict_types=1);

namespace App\Engine\Providers;

use App\Engine\Contracts\EngineLock;
use App\Engine\Support\AdvisoryEngineLock;
use App\Engine\Support\EngineSettings;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * The engine's settings, read once from config/engine.php, and its one lock for the life of the process.
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
        $this->app->singleton(EngineLock::class, AdvisoryEngineLock::class);
    }
}
