<?php

declare(strict_types=1);

namespace Domain\Rules\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;

/**
 * The Rules domain's skill, written in resources/skills/rules.md.
 */
final class RulesSkill implements Skill
{
    private const string FILE = 'rules.md';

    public function key(): string
    {
        return 'journal-rules';
    }

    public function name(): string
    {
        return 'Rules';
    }

    public function description(): string
    {
        return 'Read before working with project rules.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): array
    {
        return [
            SkillSection::text('purpose', 'Purpose', 'Rules are what every agent of the project must follow.'),
            SkillSection::markdown('what-a-rule-is', 'What a rule is', MarkdownPart::heading(self::FILE, ['Rules', 'What a rule is'])),
            SkillSection::markdown('states', 'States', MarkdownPart::heading(self::FILE, ['Rules', 'States'])),
            SkillSection::markdown('reading-rules', 'Reading rules', MarkdownPart::heading(self::FILE, ['Rules', 'Reading rules'])),
        ];
    }
}
