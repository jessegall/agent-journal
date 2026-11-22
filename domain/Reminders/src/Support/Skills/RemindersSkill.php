<?php

declare(strict_types=1);

namespace Domain\Reminders\Support\Skills;

use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

/**
 * The Reminders domain's skill, written in resources/skills/reminders.md.
 */
final class RemindersSkill implements Skill
{
    public function key(): string
    {
        return 'journal-reminders';
    }

    public function name(): string
    {
        return 'Reminders';
    }

    public function description(): string
    {
        return 'Read before promising a reminder.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::dispatchesWork();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('reminders.md');
    }
}
