<?php

declare(strict_types=1);

namespace Domain\Reminders\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;

/**
 * The Reminders domain's skill, written in resources/skills/reminders.md.
 */
final class RemindersSkill implements Skill
{
    private const string FILE = 'reminders.md';

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
        return Conditions::mainAgent();
    }

    public function sections(): array
    {
        return [
            SkillSection::text('purpose', 'Purpose', 'Reminders are things to do at a time or on an interval.'),
            SkillSection::markdown('what-a-reminder-is', 'What a reminder is', MarkdownPart::heading(self::FILE, ['Reminders', 'What a reminder is'])),
            SkillSection::markdown('in-this-version', 'In this version', MarkdownPart::heading(self::FILE, ['Reminders', 'In this version'])),
        ];
    }
}
