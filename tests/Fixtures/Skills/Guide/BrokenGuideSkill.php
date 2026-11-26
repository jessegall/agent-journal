<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills\Guide;

use App\Reads\Values\MarkdownPart;
use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SkillSections;
use App\Values\SkillSection;

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
