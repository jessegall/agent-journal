<?php

declare(strict_types=1);

namespace App\Skills\Shipped;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;

/**
 * Core's journal-profiles skill, written in resources/skills/core/profiles.md.
 */
final class ProfilesSkill implements Skill
{
    private const string FILE = 'core/profiles.md';

    public function key(): string
    {
        return 'journal-profiles';
    }

    public function name(): string
    {
        return 'Profiles';
    }

    public function description(): string
    {
        return 'Read before working with agent profiles.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): array
    {
        return [
            SkillSection::markdown('what-a-profile-is', 'What a profile is', MarkdownPart::heading(self::FILE, ['Profiles', 'What a profile is'])),
            SkillSection::markdown('types', 'Types', MarkdownPart::heading(self::FILE, ['Profiles', 'Types'])),
            SkillSection::markdown('revisions', 'Revisions', MarkdownPart::heading(self::FILE, ['Profiles', 'Revisions'])),
            SkillSection::markdown('skill-lists', 'Skill lists', MarkdownPart::heading(self::FILE, ['Profiles', 'Skill lists'])),
            SkillSection::markdown('reading-profiles', 'Reading profiles', MarkdownPart::heading(self::FILE, ['Profiles', 'Reading profiles'])),
        ];
    }
}
