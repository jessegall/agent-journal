<?php

declare(strict_types=1);

namespace App\Support\Shipped;

use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

/**
 * Core's journal skill, written in resources/skills/core/journal.md.
 */
final class JournalSkill implements Skill
{
    public function key(): string
    {
        return 'journal';
    }

    public function name(): string
    {
        return 'Journal';
    }

    public function description(): string
    {
        return 'What the journal is and how to read and write its records.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('core/journal.md');
    }
}
