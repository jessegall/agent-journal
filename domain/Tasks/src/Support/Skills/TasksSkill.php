<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SkillSections;

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
