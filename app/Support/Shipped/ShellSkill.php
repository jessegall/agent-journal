<?php

declare(strict_types=1);

namespace App\Support\Shipped;

use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

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
