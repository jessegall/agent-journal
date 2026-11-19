<?php

declare(strict_types=1);

namespace App\Skills\Shipped;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;
use App\Skills\Values\SkillSections;

/**
 * Core's shell skill for running commands and reading their output, written in resources/skills/core/shell.md.
 */
final class ShellSkill implements Skill
{
    private const string FILE = 'core/shell.md';

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
        return SkillSections::listed(
            SkillSection::text('purpose', 'Purpose', 'Commands run through the journal, which keeps their output.'),
            SkillSection::markdown('running-commands', 'Running commands', MarkdownPart::heading(self::FILE, ['Shell', 'Running commands'])),
            SkillSection::markdown('reading-output', 'Reading output', MarkdownPart::heading(self::FILE, ['Shell', 'Reading output'])),
            SkillSection::markdown('understanding-a-command-line', 'Understanding a command line', MarkdownPart::heading(self::FILE, ['Shell', 'Understanding a command line'])),
        );
    }
}
