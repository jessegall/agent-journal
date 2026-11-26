<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Agents\Drivers\Contracts\DriverCompatibilities as DriverCompatibilitiesContract;
use App\Agents\Drivers\Enums\DriverEvidence;
use App\Hosts\ArrangementSetting;
use App\Models\Projects\Host;
use App\Profiles\StartProfiles;
use App\Projects\Enums\ArrangementType;
use App\Support\Compatibility\DriverCompatibility;
use App\Values\ProtectionReport;

/**
 * The compatibility of each driver's pinned build, as its account-free capture recorded it. Contained, its arrangement
 * shows only once a contained host reports every item enforced in the agent image; a driver on the protected-account
 * trial starts once every item has its mechanism.
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
