<?php

declare(strict_types=1);

namespace Domain\Rules\Support\Skills;

use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

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
