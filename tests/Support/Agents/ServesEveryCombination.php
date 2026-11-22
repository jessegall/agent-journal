<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Agents\Enums\ArrangementType;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Models\Host;
use App\Agents\Support\HostDescriptorEnrollment;
use App\Agents\Values\EnrolledDescriptor;
use App\Agents\Values\HostDescriptor;
use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Enums\HookDriver;
use App\Drivers\Support\DefaultDrivers;
use App\Hooks\Compatibility\DriverCompatibility;

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

        foreach (HookDriver::cases() as $driver) {
            foreach (DriverVariant::cases() as $variant) {
                $descriptors[] = new HostDescriptor(
                    $drivers->keyFor($driver->value, $variant),
                    DriverCompatibility::pinned($driver)->version,
                    DefaultDrivers::PROTOCOL_VERSION,
                    ArrangementType::Local,
                    ExecutionModeType::ProtectedHost,
                );
            }
        }

        $host->recordDescriptors(HostProtocolVersion::current()->value, array_map(
            fn (EnrolledDescriptor $descriptor) => $descriptor->stored(),
            $this->app->make(HostDescriptorEnrollment::class)->enroll($descriptors),
        ));

        return $host;
    }
}
