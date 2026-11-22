<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\MarkdownParts;

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

    /**
     * The section as stored: its inline Markdown, or the reference of the part it is taken from.
     */
    public function storedText(): string
    {
        return is_string($this->content) ? $this->content : $this->content->selector();
    }

    /**
     * The section's Markdown: as written, or read from its part in the owner's folder.
     */
    public function body(MarkdownParts $parts, SkillOwner $owner): string
    {
        return $this->content instanceof MarkdownPart ? $parts->read($this->content, $owner) : $this->content;
    }
}
