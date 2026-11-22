<?php

declare(strict_types=1);

namespace App\Hooks\Resolvers;

use App\Agents\Enums\ArrangementType;
use App\Agents\Models\Host;
use App\Agents\Support\ArrangementSetting;
use App\Agents\Support\LaunchProfiles;
use App\Hooks\Compatibility\DriverCompatibility;
use App\Hooks\Contracts\DriverCompatibilities;
use App\Hooks\Enums\DriverEvidence;

/**
 * The compatibility of each driver's pinned build, as its account-free capture and native procedure recorded it.
 * Contained, its arrangement is shown only by a contained host's report that every item is enforced in the agent
 * image (doc 61, decision 7), for the launch profile a signed-in start of the driver uses (doc 78 revision 2).
 */
final readonly class PinnedCompatibilities implements DriverCompatibilities
{
    public function __construct(private ArrangementSetting $setting, private LaunchProfiles $launchProfiles) {}

    public function for(string $driver): DriverCompatibility
    {
        $pinned = DriverCompatibility::pinned($driver);

        if ($this->setting->arrangement !== ArrangementType::Contained) {
            return $pinned;
        }

        $platform = $this->launchProfiles->forSignedIn($driver)->protectionPlatform();
        $report = Host::containedProtectionOf($driver, $pinned->version, $platform);

        if ($report->isEnforcedInContainer()) {
            return $pinned->withEvidence(DriverEvidence::NativeShown, 'the agent image\'s protection report');
        }

        if (! $report->isReported()) {
            return $pinned->awaitingContainedReport($report->shortfall());
        }

        return $pinned->withContainedShortfall($report->shortfall());
    }
}
