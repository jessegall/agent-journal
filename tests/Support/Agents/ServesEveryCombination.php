<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Agents\Enums\ArrangementType;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Models\Host;
use App\Agents\Values\HostCombination;
use App\Drivers\Enums\HookDriver;
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
        $combinations = [];

        foreach (HookDriver::cases() as $driver) {
            foreach (DriverVariant::cases() as $variant) {
                $combinations[] = new HostCombination(
                    $driver,
                    DriverCompatibility::pinned($driver)->version,
                    ArrangementType::Local,
                    ExecutionModeType::ProtectedHost,
                    $variant,
                )->stored();
            }
        }

        $host->recordCombinations(HostProtocolVersion::current()->value, $combinations);

        return $host;
    }
}
