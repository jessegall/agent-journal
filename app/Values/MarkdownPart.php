<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Markdown taken from a file in the owner's resources/skills folder: the whole body, or the subtree under one exact
 * heading path such as ["Failure", "Retry"].
 */
final readonly class MarkdownPart
{
    /**
     * @param  list<string>  $headingPath
     */
    private function __construct(
        public string $file,
        public array $headingPath,
    ) {}

    public static function body(string $file): self
    {
        return new self($file, []);
    }

    /**
     * @param  list<string>  $path
     */
    public static function heading(string $file, array $path): self
    {
        return new self($file, $path);
    }

    public function isWholeBody(): bool
    {
        return $this->headingPath === [];
    }

    /**
     * How the part is named in a refusal: the file, and the heading path when there is one.
     */
    public function selector(): string
    {
        return $this->isWholeBody() ? $this->file : $this->file.' > '.implode(' > ', $this->headingPath);
    }
}
