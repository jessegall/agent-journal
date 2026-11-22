<?php

declare(strict_types=1);

namespace Domain\Memory\Support\Skills;

use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

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
