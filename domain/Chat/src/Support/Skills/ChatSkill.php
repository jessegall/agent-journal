<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SkillSections;

/**
 * The Chat domain's skill, written in resources/skills/messages.md.
 */
final class ChatSkill implements Skill
{
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

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('messages.md');
    }
}
