<?php

declare(strict_types=1);

namespace Domain\Memory\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SkillSections;

/**
 * The Memory domain's skill, written in resources/skills/memory.md.
 */
final class MemorySkill implements Skill
{
    public function key(): string
    {
        return 'journal-memory';
    }

    public function name(): string
    {
        return 'Memory';
    }

    public function description(): string
    {
        return 'Read before keeping memories.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('memory.md');
    }
}
