<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills\Guide;

use App\Support\Conditions\Conditions;
use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Values\MarkdownPart;
use App\Values\SkillSection;
use App\Values\SkillSections;

/**
 * A fixture skill with one written section and one taken from a heading of a Markdown file.
 */
final readonly class GuideSkill implements Skill
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
