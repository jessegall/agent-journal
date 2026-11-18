<?php

declare(strict_types=1);

namespace App\Numbers\Providers;

use App\Links\Support\LinkTypeRegistry;
use App\Numbers\Console\InstallNumbersCommand;
use App\Numbers\Contracts\NumberAllocator;
use App\Numbers\Models\GlobalGroup;
use App\Numbers\Models\NumberGroup;
use App\Numbers\Support\LockingNumberAllocator;
use App\Numbers\Support\NumberedTypeRegistry;
use App\Numbers\Support\NumberingOutsideCommands;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the number allocator, names the number group models for links, and registers numbers:install.
 */
final class NumbersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(NumberedTypeRegistry::class);
        $this->app->singleton(NumberingOutsideCommands::class);
        $this->app->scoped(NumberAllocator::class, LockingNumberAllocator::class);
    }

    public function boot(LinkTypeRegistry $links): void
    {
        $links->register(['core.global-group' => GlobalGroup::class, 'core.number-group' => NumberGroup::class]);
        $this->commands([InstallNumbersCommand::class]);
        $this->app->booted(fn () => $this->app->make(NumberedTypeRegistry::class)->checkDeclarations());
    }
}
