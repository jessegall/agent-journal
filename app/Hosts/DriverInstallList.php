<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Connections\Data\DriverInstallListData;
use App\Connections\Data\InstallDriverData;
use App\Support\Compatibility\DriverCompatibility;
use App\Values\DriverFamily;

/**
 * The drivers of every driver family, built from the profiles' version probes and the pinned builds, as a connected
 * machine's installer takes them.
 */
final readonly class DriverInstallList
{
    /**
     * Where a version probe is planned to run; only its argv is read.
     */
    private const string PROBE_FOLDER = '/work';

    public function __construct(private DriverProfiles $profiles) {}

    public function drivers(): DriverInstallListData
    {
        return DriverInstallListData::from(['drivers' => array_map($this->driverOf(...), DefaultDrivers::families())]);
    }

    private function driverOf(DriverFamily $family): InstallDriverData
    {
        $profile = $this->profiles->ofFamily($family->key);
        $probe = $profile->versionProbe(self::PROBE_FOLDER, ExecutablePlace::Host)->argv;

        return new InstallDriverData(
            $family->key,
            basename($probe[0]),
            DriverCompatibility::pinned($family->key)->version,
            array_slice($probe, 1),
            $profile->executableHostName(),
        );
    }
}
