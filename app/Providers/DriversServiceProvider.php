<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Drivers\DriverCatalogue as DriverCatalogueContract;
use App\Support\DefaultDrivers;
use App\Support\DriverCatalogue;
use Illuminate\Support\ServiceProvider;

/**
 * Holds the one driver registry, with the four default drivers registered in it.
 */
final class DriversServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(DriverCatalogue::class, function (): DriverCatalogue {
            $registry = new DriverCatalogue($this->app);

            foreach (DefaultDrivers::families() as $family) {
                $registry->registerFamily($family);
            }

            foreach (DefaultDrivers::registrations() as $registration) {
                $registry->register($registration);
            }

            return $registry;
        });

        $this->app->alias(DriverCatalogue::class, DriverCatalogueContract::class);
    }
}
