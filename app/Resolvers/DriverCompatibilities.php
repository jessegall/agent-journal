<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Drivers\DriverCompatibilities as DriverCompatibilitiesContract;
use App\Enums\Drivers\DriverEvidence;
use App\Enums\Projects\ArrangementType;
use App\Models\Projects\Host;
use App\Support\ArrangementSetting;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\StartProfiles;
use App\Values\ProtectionReport;

/**
 * The compatibility of each driver's pinned build, as its account-free capture and native procedure recorded it.
 * Contained, its arrangement is shown only by a contained host's report that every item is enforced in the agent
 * image, for the start profile a signed-in start of the driver uses. A
 * driver on the protected-account trial starts once every item has its mechanism, before the runs that show each
 * hold are recorded, since the trial is where those runs are made.
 */
final readonly class DriverCompatibilities implements DriverCompatibilitiesContract
{
    public function __construct(private ArrangementSetting $setting, private StartProfiles $startProfiles) {}

    public function for(string $driver): DriverCompatibility
    {
        $pinned = DriverCompatibility::pinned($driver);

        if ($this->setting->arrangement !== ArrangementType::Contained) {
            return $pinned;
        }

        $platform = $this->startProfiles->forSignedIn($driver)->protectionPlatform()->value;
        $report = Host::resolveContainedProtectionOf(ProtectionReport::unreported($driver, $pinned->version, $platform));

        if ($report->isEnforcedInContainer()) {
            return $pinned->withEvidence(DriverEvidence::NativeShown, 'the agent image\'s protection report');
        }

        if ($this->startProfiles->isOnTrial($driver) && $report->awaitsEvidenceOnly()) {
            return $pinned->withEvidence(
                DriverEvidence::NativeShown,
                'the protected-account trial of this installation',
            );
        }

        if (! $report->isReported()) {
            return $pinned->awaitingContainedReport($report->shortfall());
        }

        return $pinned->withContainedShortfall($report->shortfall());
    }
}
