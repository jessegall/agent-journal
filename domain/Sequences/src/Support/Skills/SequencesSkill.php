<?php

declare(strict_types=1);

namespace Domain\Sequences\Support\Skills;

use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

/**
 * The Sequences domain's skill, written in resources/skills/sequences.md.
 */
final class SequencesSkill implements Skill
{
    public function key(): string
    {
        return 'journal-sequences';
    }

    public function name(): string
    {
        return 'Sequences';
    }

    public function description(): string
    {
        return 'Read before following a sequence.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('sequences.md');
    }
}
