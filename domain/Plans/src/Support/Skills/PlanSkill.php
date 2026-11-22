<?php

declare(strict_types=1);

namespace Domain\Plans\Support\Skills;

use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Support\Conditions\Conditions;
use App\Values\ProfileBase;
use App\Values\SkillSections;

/**
 * The Plans domain's skill: what a plan is and how its work is held.
 */
final class PlanSkill implements Skill
{
    public function key(): string
    {
        return 'journal-plans';
    }

    public function name(): string
    {
        return 'Plans';
    }

    public function description(): string
    {
        return 'Read before working with plans.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::any(Conditions::dispatchesWork(), Conditions::profileBases(ProfileBase::writingHelper()));
    }

    public function sections(): SkillSections
    {
        return SkillSections::fromFile('plans.md');
    }
}
