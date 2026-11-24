<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Reads\MarkdownParts;
use App\Exceptions\SkillSourceInvalid;

/**
 * The sections of a skill: either listed by hand, or read from the headings of one file in the owner's skills folder.
 */
final readonly class SkillSections
{
    /**
     * @param  list<SkillSection>|string  $source  the listed sections, or the file they are read from
     */
    private function __construct(public array|string $source) {}

    public static function fromFile(string $file): self
    {
        return new self($file);
    }

    public static function listed(SkillSection ...$sections): self
    {
        return new self(array_values($sections));
    }

    /**
     * The sections in order: as listed, or as the skill's file gives them under the skill's name.
     *
     * @return list<SkillSection>
     *
     * @throws SkillSourceInvalid
     */
    public function resolve(MarkdownParts $parts, SkillOwner $owner, string $name): array
    {
        if (is_string($this->source)) {
            return $parts->sectionsOf($this->source, $owner, $name);
        }

        return $this->source;
    }
}
