<?php

declare(strict_types=1);

namespace App\Core;

use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Loads the core that every domain and module builds on: the migrations and listeners of its agents, hooks and links.
 * The core names no domain; domains and modules plug into it.
 */
final class CoreServiceProvider extends ServiceProvider
{
    private const array AREAS = ['Agents', 'Hooks', 'Links'];

    public function register(): void
    {
        EventServiceProvider::addEventDiscoveryPaths(array_values(array_filter(
            array_map(fn (string $area) => __DIR__."/{$area}/Listeners", self::AREAS),
            is_dir(...),
        )));
    }

    public function boot(): void
    {
        foreach (self::AREAS as $area) {
            $this->loadMigrationsFrom(__DIR__."/{$area}/Database/Migrations");
        }
    }
}
