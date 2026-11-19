<?php

declare(strict_types=1);

namespace Domain\Plans\Skills;

use App\Profiles\Values\ProfileBase;
use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;
use App\Skills\Values\SkillSections;

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
        return SkillSections::listed(
            SkillSection::text('purpose', 'Purpose', 'A plan orders the work: phases of tasks, worked one phase after another.'),
            SkillSection::markdown('states', 'States', MarkdownPart::heading('plans.md', ['Plans', 'States'])),
            SkillSection::markdown('holding', 'Holding plan work', MarkdownPart::heading('plans.md', ['Plans', 'Holding plan work'])),
        );
    }
}
