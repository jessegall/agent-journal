<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Skills;

use App\Support\Conditions\Conditions;
use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillCondition;
use App\Values\SkillSection;
use App\Values\SkillSections;

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
