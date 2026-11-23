<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillCondition;
use App\Models\Skills\SkillRevision;
use App\Values\SkillSections;

/**
 * A skill a user stored, read from one revision: its sections are the literal Markdown that was saved, never an
 * include, and nothing in it is run or built as code.
 */
final readonly class StoredSkill implements Skill
{
    public function __construct(
        private string $key,
        private SkillRevision $revision,
        private SkillCondition $condition,
    ) {}

    public function key(): string
    {
        return $this->key;
    }

    public function name(): string
    {
        return $this->revision->name;
    }

    public function description(): string
    {
        return $this->revision->description;
    }

    public function condition(): SkillCondition
    {
        return $this->condition;
    }

    public function sections(): SkillSections
    {
        return SkillSections::listed(...$this->revision->sections);
    }

    public function revisionNumber(): int
    {
        return $this->revision->revision;
    }
}
