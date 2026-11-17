<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Hooks\Stack\RegisteredStateFactory;
use App\Domain\Hooks\Stack\StateFactory;
use App\Domain\Hooks\Stack\StateTypes;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the state types and the retry window once per worker, and the state factory once per request.
 */
final class HooksServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(StateTypes::class);
        $this->app->scoped(StateFactory::class, RegisteredStateFactory::class);
        $this->app->singleton(HookRetryWindow::class, fn () => new HookRetryWindow($this->app->make('config')->integer('hooks.retry_seconds')));
    }
}
