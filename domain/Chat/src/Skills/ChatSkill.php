<?php

declare(strict_types=1);

namespace Domain\Chat\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;

/**
 * The Chat domain's skill, written in resources/skills/messages.md.
 */
final class ChatSkill implements Skill
{
    private const string FILE = 'messages.md';

    public function key(): string
    {
        return 'journal-messages';
    }

    public function name(): string
    {
        return 'Messages';
    }

    public function description(): string
    {
        return 'Read before reading or answering messages.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::dispatchesWork();
    }

    public function sections(): array
    {
        return [
            SkillSection::text('purpose', 'Purpose', 'Messages are how users and agents talk in the journal.'),
            SkillSection::markdown('where-messages-come-from', 'Where messages come from', MarkdownPart::heading(self::FILE, ['Messages', 'Where messages come from'])),
            SkillSection::markdown('states', 'States', MarkdownPart::heading(self::FILE, ['Messages', 'States'])),
            SkillSection::markdown('answering', 'Answering', MarkdownPart::heading(self::FILE, ['Messages', 'Answering'])),
        ];
    }
}
