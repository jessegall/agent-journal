<?php

declare(strict_types=1);

namespace App\Values;

use App\Reads\Contracts\MarkdownParts;
use App\Reads\Values\MarkdownPart;
use Spatie\LaravelData\Data;

/**
 * One section of a skill: a stable key, its heading, and its Markdown written inline or taken from a Markdown part.
 */
final class SkillSection extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $heading,
        public readonly string|MarkdownPart $content,
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
        if (is_string($this->content)) {
            return $this->content;
        }

        return $this->content->selector();
    }

    /**
     * The section's Markdown: as written, or read from its part in the owner's folder.
     */
    public function body(MarkdownParts $parts, SkillOwner $owner): string
    {
        if ($this->content instanceof MarkdownPart) {
            return $parts->read($this->content, $owner);
        }

        return $this->content;
    }
}
