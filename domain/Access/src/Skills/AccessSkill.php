<?php

declare(strict_types=1);

namespace Domain\Access\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;

/**
 * The Access domain's skill, written in resources/skills/access.md.
 */
final class AccessSkill implements Skill
{
    private const string FILE = 'access.md';

    public function key(): string
    {
        return 'journal-access';
    }

    public function name(): string
    {
        return 'Access';
    }

    public function description(): string
    {
        return 'Read before acting on who may use the journal.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::dispatchesWork();
    }

    public function sections(): array
    {
        return [
            SkillSection::text('purpose', 'Purpose', 'Access decides who may use the journal and what an agent may do.'),
            SkillSection::markdown('who-may-use-the-journal', 'Who may use the journal', MarkdownPart::heading(self::FILE, ['Access', 'Who may use the journal'])),
            SkillSection::markdown('agents', 'Agents', MarkdownPart::heading(self::FILE, ['Access', 'Agents'])),
        ];
    }
}
