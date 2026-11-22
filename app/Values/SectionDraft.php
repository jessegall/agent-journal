<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One section of a stored skill as a user writes it: a key, a heading and literal Markdown.
 */
final readonly class SectionDraft
{
    public function __construct(
        public string $key,
        public string $heading,
        public string $markdown,
    ) {}

    public function toSection(): SkillSection
    {
        return SkillSection::text($this->key, $this->heading, $this->markdown);
    }
}
