<?php

declare(strict_types=1);

namespace Domain\Access\Support\Skills;

use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

/**
 * The Access domain's skill, written in resources/skills/access.md.
 */
final class AccessSkill implements Skill
{
    public function key(): string
    {
        return 'journal-access';
    }

    public function name(): string
    {
        return 'Access';
    }

    public function description(): string
    {
        return 'Read before acting on who may use the journal.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::dispatchesWork();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('access.md');
    }
}
