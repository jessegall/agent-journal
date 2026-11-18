<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Enums\SkillReload;
use App\Skills\Values\LaunchSkillSet;
use App\Skills\Values\PublishedSkill;
use App\Skills\Values\SkillDelivery;

/**
 * How one program finds its skills: where a launch's set goes, what the launch adds, how an agent is told to read a
 * skill, and whether a running session sees a changed set.
 */
interface ProgramSkills
{
    public function delivery(LaunchSkillSet $skills): SkillDelivery;

    public function instruction(PublishedSkill $skill): string;

    public function reloadMode(): SkillReload;
}
