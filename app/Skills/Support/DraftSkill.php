<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillSections;

/**
 * A submitted draft seen as a skill, so it is rendered and checked against every limit before anything is saved.
 */
final readonly class DraftSkill implements Skill
{
    public function __construct(
        private string $key,
        private SkillDraft $draft,
        private SkillCondition $condition,
    ) {}

    public function key(): string
    {
        return $this->key;
    }

    public function name(): string
    {
        return $this->draft->name;
    }

    public function description(): string
    {
        return $this->draft->description;
    }

    public function condition(): SkillCondition
    {
        return $this->condition;
    }

    public function sections(): SkillSections
    {
        return SkillSections::listed(...array_map(fn (SectionDraft $section) => $section->toSection(), $this->draft->sections));
    }
}
