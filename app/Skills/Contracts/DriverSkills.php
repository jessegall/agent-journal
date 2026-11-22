<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Enums\SkillReload;
use App\Skills\Values\PublishedSkill;
use App\Skills\Values\SkillDelivery;
use App\Skills\Values\SkillKey;

/**
 * How one driver finds its skills: the layout of a published set, the folder the host writes it to and what the
 * start adds, how an agent is told to read a skill, and whether a running session sees a changed set.
 */
interface DriverSkills
{
    /**
     * The path of a skill's SKILL.md inside the driver's target folder.
     */
    public function skillFile(SkillKey $key): string;

    /**
     * Files the driver needs beside the skills to discover them, bytes by path inside the target folder.
     *
     * @return array<string, string>
     */
    public function supportFiles(): array;

    public function delivery(): SkillDelivery;

    public function instruction(PublishedSkill $skill): string;

    public function reloadMode(): SkillReload;
}
