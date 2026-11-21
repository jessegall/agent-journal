<?php

declare(strict_types=1);

namespace App\Skills\Data;

use App\Skills\Values\SkillSection;
use Spatie\LaravelData\Data;

/**
 * One section of a stored skill revision as its JSON column keeps it: key, heading and literal Markdown.
 */
final class StoredSkillSection extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $heading,
        public readonly string $markdown,
    ) {}

    public function section(): SkillSection
    {
        return SkillSection::text($this->key, $this->heading, $this->markdown);
    }
}
