<?php

declare(strict_types=1);

namespace Domain\Tasks\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;
use App\Skills\Values\SkillSections;

/**
 * The Tasks domain's skill, written in resources/skills/tasks.md.
 */
final class TasksSkill implements Skill
{
    private const string FILE = 'tasks.md';

    public function key(): string
    {
        return 'journal-tasks';
    }

    public function name(): string
    {
        return 'Tasks';
    }

    public function description(): string
    {
        return 'Read before working with tasks.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::listed(
            SkillSection::text('purpose', 'Purpose', 'A task is one unit of work, from open to finished.'),
            SkillSection::markdown('states', 'States', MarkdownPart::heading(self::FILE, ['Tasks', 'States'])),
            SkillSection::markdown('the-tasks-you-hold', 'The tasks you hold', MarkdownPart::heading(self::FILE, ['Tasks', 'The tasks you hold'])),
            SkillSection::markdown('starting-blocking-and-finishing', 'Starting, blocking and finishing', MarkdownPart::heading(self::FILE, ['Tasks', 'Starting, blocking and finishing'])),
        );
    }
}
