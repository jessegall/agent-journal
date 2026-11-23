<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Drivers\DriverCompatibilities;
use App\Enums\ArrangementType;
use App\Enums\DriverEvidence;
use App\Models\Projects\Host;
use App\Support\ArrangementSetting;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\LaunchProfiles;
use App\Values\ProtectionReport;

/**
 * The compatibility of each driver's pinned build, as its account-free capture and native procedure recorded it.
 * Contained, its arrangement is shown only by a contained host's report that every item is enforced in the agent
 * image (doc 61, decision 7), for the launch profile a signed-in start of the driver uses (doc 78 revision 2). A
 * driver on the protected-account trial starts once every item has its mechanism, before the runs that show each
 * hold are recorded, since the trial is where those runs are made.
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
        $report = Host::containedProtectionOf(ProtectionReport::unreported($driver, $pinned->version, $platform));

        if ($report->isEnforcedInContainer()) {
            return $pinned->withEvidence(DriverEvidence::NativeShown, 'the agent image\'s protection report');
        }

        if ($this->launchProfiles->isOnTrial($driver) && $report->awaitsEvidenceOnly()) {
            return $pinned->withEvidence(DriverEvidence::NativeShown, 'the protected-account trial of this installation');
        }

        if (! $report->isReported()) {
            return $pinned->awaitingContainedReport($report->shortfall());
        }

        return $pinned->withContainedShortfall($report->shortfall());
    }
}
