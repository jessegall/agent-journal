<?php

declare(strict_types=1);

namespace App\Skills\Shipped;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SkillSections;

/**
 * Core's shell skill for running commands and reading their output, written in resources/skills/core/shell.md.
 */
final class ShellSkill implements Skill
{
    public function key(): string
    {
        return 'journal-shell';
    }

    public function name(): string
    {
        return 'Shell';
    }

    public function description(): string
    {
        return 'Read before running shell commands or reading their output.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('core/shell.md');
    }
}
