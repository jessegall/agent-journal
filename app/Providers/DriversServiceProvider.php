<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\DriverCatalogue;
use App\Support\DefaultDrivers;
use App\Support\DriverRegistry;
use Illuminate\Support\ServiceProvider;

/**
 * Holds the one driver registry, with the four default drivers registered in it.
 */
final class DriversServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(DriverRegistry::class, function (): DriverRegistry {
            $registry = new DriverRegistry($this->app);

            foreach (DefaultDrivers::families() as $family) {
                $registry->registerFamily($family);
            }

            foreach (DefaultDrivers::registrations() as $registration) {
                $registry->register($registration);
            }

            return $registry;
        });

        $this->app->alias(DriverRegistry::class, DriverCatalogue::class);
    }
}
