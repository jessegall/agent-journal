<?php

declare(strict_types=1);

namespace App\Support\Shipped;

use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\SkillSections;

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
