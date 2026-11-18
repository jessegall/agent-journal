<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * One section of a skill: a stable key, its heading, and its Markdown written inline or taken from a Markdown part.
 */
final readonly class SkillSection
{
    private function __construct(
        public string $key,
        public string $heading,
        public string|MarkdownPart $content,
    ) {}

    public static function text(string $key, string $heading, string $markdown): self
    {
        return new self($key, $heading, $markdown);
    }

    public static function markdown(string $key, string $heading, MarkdownPart $part): self
    {
        return new self($key, $heading, $part);
    }
}
