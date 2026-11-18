<?php

declare(strict_types=1);

namespace Domain\Sequences\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;

/**
 * The Sequences domain's skill, written in resources/skills/sequences.md.
 */
final class SequencesSkill implements Skill
{
    private const string FILE = 'sequences.md';

    public function key(): string
    {
        return 'journal-sequences';
    }

    public function name(): string
    {
        return 'Sequences';
    }

    public function description(): string
    {
        return 'Read before following a sequence.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): array
    {
        return [
            SkillSection::text('purpose', 'Purpose', 'Sequences are steps you follow one at a time.'),
            SkillSection::markdown('what-a-sequence-is', 'What a sequence is', MarkdownPart::heading(self::FILE, ['Sequences', 'What a sequence is'])),
            SkillSection::markdown('following-a-run', 'Following a run', MarkdownPart::heading(self::FILE, ['Sequences', 'Following a run'])),
        ];
    }
}
