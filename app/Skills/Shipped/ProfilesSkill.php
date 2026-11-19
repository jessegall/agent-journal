<?php

declare(strict_types=1);

namespace App\Skills\Shipped;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SkillSections;

/**
 * Core's journal-profiles skill, written in resources/skills/core/profiles.md.
 */
final class ProfilesSkill implements Skill
{
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
        return Conditions::dispatchesWork();
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('core/profiles.md');
    }
}
