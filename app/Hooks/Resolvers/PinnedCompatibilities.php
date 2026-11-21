<?php

declare(strict_types=1);

namespace App\Hooks\Resolvers;

use App\Agents\Enums\ArrangementType;
use App\Agents\Models\Host;
use App\Agents\Support\ArrangementSetting;
use App\Hooks\Contracts\ProgramCompatibilities;
use App\Hooks\Enums\ProgramEvidence;
use App\Hooks\Support\ProgramCompatibility;
use App\Programs\Enums\HookProgram;

/**
 * The compatibility of each program's pinned build, as its account-free capture and native procedure recorded it.
 * Contained, its arrangement is shown only by a contained host's report that every item is enforced in the agent
 * image (doc 61, decision 7).
 */
final readonly class PinnedCompatibilities implements ProgramCompatibilities
{
    public function __construct(private ArrangementSetting $setting) {}

    public function for(HookProgram $program): ProgramCompatibility
    {
        $pinned = ProgramCompatibility::pinned($program);

        if ($this->setting->arrangement !== ArrangementType::Contained) {
            return $pinned;
        }

        $report = Host::containedProtectionOf($program, $pinned->version);

        if ($report->isEnforcedInContainer()) {
            return $pinned->withEvidence(ProgramEvidence::NativeShown, 'the agent image\'s protection report');
        }

        return $pinned->withContainedShortfall($report->shortfall());
    }
}
