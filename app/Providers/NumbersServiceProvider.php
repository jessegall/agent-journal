<?php

declare(strict_types=1);

namespace App\Providers;

use App\Console\Commands\InstallNumbersCommand;
use App\Support\LockingNumberAllocator;
use App\Support\NumberedTypeRegistry;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the number allocator, names the number group models for links, and registers numbers:install.
 */
final class NumbersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(NumberedTypeRegistry::class);
        $this->app->scoped(LockingNumberAllocator::class);
    }

    public function boot(): void
    {
        $this->commands([InstallNumbersCommand::class]);
        $this->app->booted(fn () => $this->app->make(NumberedTypeRegistry::class)->checkDeclarations());
    }
}
