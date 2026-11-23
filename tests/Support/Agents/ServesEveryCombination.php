<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\ArrangementType;
use App\Enums\DriverVariant;
use App\Enums\ExecutionModeType;
use App\Models\Host;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\DefaultDrivers;
use App\Support\HostDescriptorEnrollment;
use App\Values\EnrolledDescriptor;
use App\Values\HostDescriptor;

/**
 * Enrols a local host of this protocol that declared every driver and variant on the protected host, so a main start
 * has a host to run on.
 */
trait ServesEveryCombination
{
    private function serveEveryCombination(): Host
    {
        $host = Host::create('local host', 'secret', [base_path()], ArrangementType::Local);
        $drivers = $this->app->make(DriverCatalogue::class);
        $descriptors = [];

        foreach (DefaultDrivers::familyKeys() as $driver) {
            foreach (DriverVariant::cases() as $variant) {
                $descriptors[] = new HostDescriptor(
                    $drivers->keyFor($driver, $variant),
                    DriverCompatibility::pinned($driver)->version,
                    ArrangementType::Local,
                    ExecutionModeType::ProtectedHost,
                );
            }
        }

        $host->recordDescriptors(array_map(
            fn (EnrolledDescriptor $descriptor) => $descriptor->stored(),
            $this->app->make(HostDescriptorEnrollment::class)->enroll($descriptors),
        ));

        return $host;
    }
}
