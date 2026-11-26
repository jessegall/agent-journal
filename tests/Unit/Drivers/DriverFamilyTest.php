<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Contracts\Drivers\DriverCatalogue as DriverCatalogueContract;
use App\Exceptions\DriverFamilyUnknown;
use App\Support\DriverCatalogue;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use Tests\TestCase;

/**
 * Ownership and interface examples: a family's facts, such as its provider and the name the host knows it
 * by, come from the catalogue, and a driver is registered only under a family the catalogue knows.
 */
final class DriverFamilyTest extends TestCase
{
    public function test_every_registered_driver_names_a_registered_family(): void
    {
        $drivers = $this->app->make(DriverCatalogueContract::class);
        $keys = array_map(fn (DriverFamily $family) => $family->key, $drivers->families());

        foreach ($drivers->catalogue() as $registration) {
            $this->assertContains($registration->family, $keys, (string) $registration->key);
        }
    }

    public function test_a_driver_of_an_unknown_family_is_refused(): void
    {
        $registry = new DriverCatalogue($this->app);
        $claude = $this->app->make(DriverCatalogueContract::class)->catalogue()[0];

        $this->assertThrows(
            fn () => $registry->register(new DriverRegistration(
                DriverKey::from('extension-driver'),
                'extension-family',
                $claude->driverType,
                $claude->label,
                [],
                $claude->hookProtocol,
                $claude->accountProtocol,
                $claude->skillProtocol,
                $claude->capabilities,
                [],
            )),
            DriverFamilyUnknown::class,
            DriverFamilyUnknown::for('extension-family')->getMessage(),
        );
    }
}
