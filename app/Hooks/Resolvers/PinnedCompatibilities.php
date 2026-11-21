<?php

declare(strict_types=1);

namespace App\Hooks\Resolvers;

use App\Agents\Enums\ArrangementType;
use App\Agents\Models\Host;
use App\Agents\Support\ArrangementSetting;
use App\Drivers\Enums\HookDriver;
use App\Hooks\Contracts\DriverCompatibilities;
use App\Hooks\Enums\DriverEvidence;
use App\Hooks\Support\DriverCompatibility;

/**
 * The compatibility of each program's pinned build, as its account-free capture and native procedure recorded it.
 * Contained, its arrangement is shown only by a contained host's report that every item is enforced in the agent
 * image (doc 61, decision 7).
 */
final readonly class PinnedCompatibilities implements DriverCompatibilities
{
    public function __construct(private ArrangementSetting $setting) {}

    public function for(HookDriver $driver): DriverCompatibility
    {
        $pinned = DriverCompatibility::pinned($driver);

        if ($this->setting->arrangement !== ArrangementType::Contained) {
            return $pinned;
        }

        $report = Host::containedProtectionOf($driver, $pinned->version);

        if ($report->isEnforcedInContainer()) {
            return $pinned->withEvidence(DriverEvidence::NativeShown, 'the agent image\'s protection report');
        }

        return $pinned->withContainedShortfall($report->shortfall());
    }
}
