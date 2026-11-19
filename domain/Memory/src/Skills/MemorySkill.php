<?php

declare(strict_types=1);

namespace Domain\Memory\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;
use App\Skills\Values\SkillSections;

/**
 * The Memory domain's skill, written in resources/skills/memory.md.
 */
final class MemorySkill implements Skill
{
    private const string FILE = 'memory.md';

    public function key(): string
    {
        return 'journal-memory';
    }

    public function name(): string
    {
        return 'Memory';
    }

    public function description(): string
    {
        return 'Read before keeping memories.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::listed(
            SkillSection::text('purpose', 'Purpose', 'Memories keep what matters beyond your context window.'),
            SkillSection::markdown('what-a-memory-is', 'What a memory is', MarkdownPart::heading(self::FILE, ['Memory', 'What a memory is'])),
            SkillSection::markdown('weights', 'Weights', MarkdownPart::heading(self::FILE, ['Memory', 'Weights'])),
            SkillSection::markdown('keeping-memories', 'Keeping memories', MarkdownPart::heading(self::FILE, ['Memory', 'Keeping memories'])),
            SkillSection::markdown('numbers', 'Numbers', MarkdownPart::heading(self::FILE, ['Memory', 'Numbers'])),
        );
    }
}
