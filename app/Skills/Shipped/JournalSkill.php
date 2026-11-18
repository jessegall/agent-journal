<?php

declare(strict_types=1);

namespace App\Skills\Shipped;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;

/**
 * Core's journal skill, written in resources/skills/core/journal.md.
 */
final class JournalSkill implements Skill
{
    private const string FILE = 'core/journal.md';

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

    public function sections(): array
    {
        return [
            SkillSection::markdown('what-it-is', 'What it is', MarkdownPart::heading(self::FILE, ['Journal', 'What it is'])),
            SkillSection::markdown('reading-records', 'Reading records', MarkdownPart::heading(self::FILE, ['Journal', 'Reading records'])),
            SkillSection::markdown('writing-records', 'Writing records', MarkdownPart::heading(self::FILE, ['Journal', 'Writing records'])),
            SkillSection::markdown('runs-and-their-output', 'Runs and their output', MarkdownPart::heading(self::FILE, ['Journal', 'Runs and their output'])),
            SkillSection::markdown('when-something-is-refused', 'When something is refused', MarkdownPart::heading(self::FILE, ['Journal', 'When something is refused'])),
        ];
    }
}
