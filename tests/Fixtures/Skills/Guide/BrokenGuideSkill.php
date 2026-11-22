<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills\Guide;

use App\Support\Conditions\Conditions;
use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillCondition;
use App\Values\MarkdownPart;
use App\Values\SkillSection;
use App\Values\SkillSections;

/**
 * A shipped fixture skill whose Markdown part names a heading that is not there.
 */
final class BrokenGuideSkill implements Skill
{
    public function key(): string
    {
        return 'journal-guide';
    }

    public function name(): string
    {
        return 'Guide';
    }

    public function description(): string
    {
        return 'Broken on purpose.';
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::listed(
SkillSection::markdown('missing', 'Missing', MarkdownPart::heading('guide.md', ['Guide', 'Nowhere'])),
);
    }
}
