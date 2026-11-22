<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\SkillSourceInvalid;
use App\Values\MarkdownPart;
use App\Values\SkillOwner;
use App\Values\SkillSection;

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
