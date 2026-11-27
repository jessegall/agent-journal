<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Agents\Drivers\Contracts\DriverCompatibilities as DriverCompatibilitiesContract;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\Enums\DriverEvidence;
use App\Hosts\ArrangementSetting;
use App\Projects\Enums\ArrangementType;
use App\Support\Compatibility\DriverCompatibility;

/**
 * The compatibility of each driver's pinned build, as its account-free capture recorded it. Contained, every driver
 * starts protected, which the agent image's build proves before the image is used.
 */
final readonly class DriverCompatibilities implements DriverCompatibilitiesContract
{
    private const string EVIDENCE = 'the agent image\'s protected start, checked as it is built';

    public function __construct(private ArrangementSetting $setting, private PinnedBuilds $builds) {}

    public function for(string $driver): DriverCompatibility
    {
        $pinned = DriverCompatibility::pinned($driver, $this->builds->versionOf($driver));

        if ($this->setting->arrangement !== ArrangementType::Contained) {
            return $pinned;
        }

        return $pinned->withEvidence(DriverEvidence::NativeShown, self::EVIDENCE);
    }
}
