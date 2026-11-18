<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Enums\SkillReload;
use App\Skills\Values\LaunchSkillSet;
use App\Skills\Values\PublishedSkill;
use App\Skills\Values\SkillDelivery;
use App\Skills\Values\SkillKey;

/**
 * How one program finds its skills: the layout of a published set, where a launch's set goes, what the launch adds,
 * how an agent is told to read a skill, and whether a running session sees a changed set.
 */
interface ProgramSkills
{
    /**
     * The path of a skill's SKILL.md inside the program's target folder.
     */
    public function skillFile(SkillKey $key): string;

    /**
     * Files the program needs beside the skills to discover them, bytes by path inside the target folder.
     *
     * @return array<string, string>
     */
    public function supportFiles(): array;

    public function delivery(LaunchSkillSet $skills): SkillDelivery;

    public function instruction(PublishedSkill $skill): string;

    public function reloadMode(): SkillReload;
}
