<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillSection;

/**
 * The Markdown of a skill's source files, read from its owner's resources/skills folder.
 */
interface MarkdownParts
{
    /**
     * The part's Markdown: the whole body without its front matter, or the subtree under its heading path without
     * that heading.
     *
     * @throws SkillSourceInvalid
     */
    public function read(MarkdownPart $part, SkillOwner $owner): string;

    /**
     * The sections of a skill file: the text under its # title as the purpose, then one section per ## heading.
     *
     * @return list<SkillSection>
     *
     * @throws SkillSourceInvalid
     */
    public function sectionsOf(string $file, SkillOwner $owner, string $name): array;
}
