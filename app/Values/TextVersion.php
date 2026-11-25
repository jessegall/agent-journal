<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\TextVersionUnavailable;
use App\Support\MarkdownText;
use App\Support\Section;

/**
 * One immutable version of a record's text: its id and label, its LF-normalised text and its sections.
 */
final readonly class TextVersion
{
    /**
     * @param  list<Section>  $sections
     */
    private function __construct(
        public string $id,
        public string $label,
        public string $text,
        public array $sections,
    ) {}

    /**
     * @param  array{id: string, label: string, text: string, sections: list<Section>}  $fields
     */
    public static function from(array $fields): self
    {
        return new self(
            $fields['id'],
            $fields['label'],
            str_replace([
                "\r\n",
                "\r",
            ], "\n", $fields['text']),
            $fields['sections'],
        );
    }

    /**
     * A version of a Markdown text, its sections read from the text itself.
     */
    public static function ofMarkdown(string $id, string $label, string $text): self
    {
        $markdown = MarkdownText::body($text);

        return new self($id, $label, $markdown->text, $markdown->sections);
    }

    /**
     * Version 1 of a Markdown text that has no other version; asking for any other version is refused.
     *
     * @throws TextVersionUnavailable
     */
    public static function ofOnlyMarkdown(string|null $askedVersion, string $label, string $text): self
    {
        if ($askedVersion !== null && $askedVersion !== '1') {
            throw TextVersionUnavailable::named($askedVersion);
        }

        return self::ofMarkdown('1', $label, $text);
    }

    /**
     * The lines from first to last, counted from 1.
     */
    public function lines(int $first, int $last): string
    {
        return implode("\n", array_slice(explode("\n", $this->text), $first - 1, $last - $first + 1));
    }

    public function lineCount(): int
    {
        return substr_count($this->text, "\n") + 1;
    }

    public function hasSection(int $number): bool
    {
        return $number >= 1 && $number <= count($this->sections);
    }
}
