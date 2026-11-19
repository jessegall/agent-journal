<?php

declare(strict_types=1);

namespace Domain\Rules\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SkillSections;

/**
 * The Rules domain's skill, written in resources/skills/rules.md.
 */
final class RulesSkill implements Skill
{
    public function key(): string
    {
        return 'journal-rules';
    }

    public function name(): string
    {
        return 'Rules';
    }

    public function description(): string
    {
        return 'Read before working with project rules.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('rules.md');
    }
}
