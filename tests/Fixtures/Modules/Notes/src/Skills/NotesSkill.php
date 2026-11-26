<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SkillSections;
use App\Values\SkillSection;

/**
 * The Notes module's one skill: how an agent keeps its notes.
 */
final class NotesSkill implements Skill
{
    public function key(): string
    {
        return 'notes-writing';
    }

    public function name(): string
    {
        return 'Notes';
    }

    public function description(): string
    {
        return 'Read before writing notes.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::listed(
            SkillSection::text('purpose', 'Notes', 'A note keeps what an agent learned while it works.'),
        );
    }
}
