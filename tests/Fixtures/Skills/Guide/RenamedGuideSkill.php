<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills\Guide;

use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillSection;
use App\Skills\Values\SkillSections;

/**
 * The guide fixture skill under another class name, with the same key and text.
 */
final readonly class RenamedGuideSkill implements Skill
{
    /**
     * @param  list<string>  $headingPath
     */
    public function __construct(
        private string $file = 'guide.md',
        private array $headingPath = ['Guide', 'Failure', 'Retry'],
        private string $description = 'Read before you retry.',
    ) {}

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
        return $this->description;
    }

    public function condition(): SkillCondition
    {
        return Conditions::everyone();
    }

    public function sections(): SkillSections
    {
        return SkillSections::listed(
            SkillSection::text('purpose', 'Purpose', "A guide to retrying.\r\n"),
            SkillSection::markdown('retry', 'Retrying', MarkdownPart::heading($this->file, $this->headingPath)),
        );
    }
}
