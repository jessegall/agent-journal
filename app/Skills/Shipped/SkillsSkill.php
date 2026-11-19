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
 * Core's journal-skills skill, written in resources/skills/core/skills.md.
 */
final class SkillsSkill implements Skill
{
    private const string FILE = 'core/skills.md';

    public function key(): string
    {
        return 'journal-skills';
    }

    public function name(): string
    {
        return 'Skills';
    }

    public function description(): string
    {
        return 'Read before working with skills.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::listed(
            SkillSection::markdown('what-a-skill-is', 'What a skill is', MarkdownPart::heading(self::FILE, ['Skills', 'What a skill is'])),
            SkillSection::markdown('keys', 'Keys', MarkdownPart::heading(self::FILE, ['Skills', 'Keys'])),
            SkillSection::markdown('reading-skills', 'Reading skills', MarkdownPart::heading(self::FILE, ['Skills', 'Reading skills'])),
            SkillSection::markdown('when-the-catalogue-cannot-be-built', 'When the catalogue cannot be built', MarkdownPart::heading(self::FILE, ['Skills', 'When the catalogue cannot be built'])),
            SkillSection::markdown('what-a-skill-does-not-do', 'What a skill does not do', MarkdownPart::heading(self::FILE, ['Skills', 'What a skill does not do'])),
        );
    }
}
