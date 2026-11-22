<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Skills;

use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

/**
 * The Tasks domain's skill, written in resources/skills/tasks.md.
 */
final class TasksSkill implements Skill
{
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
        return SkillSections::fromFile('tasks.md');
    }
}
