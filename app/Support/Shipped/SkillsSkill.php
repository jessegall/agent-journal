<?php

declare(strict_types=1);

namespace App\Support\Shipped;

use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

/**
 * Core's journal-skills skill, written in resources/skills/core/skills.md.
 */
final class SkillsSkill implements Skill
{
    public function key(): string
    {
        return 'journal-skills';
    }

    public function name(): string
    {
        return 'Skills';
    }

    public function description(): string
    {
        return 'Read before working with skills.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('core/skills.md');
    }
}
