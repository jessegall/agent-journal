<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Exceptions\ContentMissing;
use Domain\Documents\Exceptions\ContentTooLarge;
use Domain\Documents\Exceptions\MarkdownInvalid;
use Domain\Documents\Exceptions\SectionMissing;
use Domain\Documents\Exceptions\TextMatchInvalid;
use League\CommonMark\CommonMarkConverter;

/**
 * The Markdown body of a document or report: checked when it is made, read by sections, and rendered to safe HTML.
 * Line endings become LF; every other character is kept as written.
 */
final readonly class MarkdownText
{
    public const int BODY_BYTES = 1_048_576;

    public const int TITLE_CHARACTERS = 200;

    public const int ABSTRACT_CHARACTERS = 500;

    /**
     * @param  list<Section>  $sections
     */
    private function __construct(public string $text, public array $sections) {}

    /**
     * @throws MarkdownInvalid|ContentMissing|ContentTooLarge
     */
    public static function body(string $text): self
    {
        if (! mb_check_encoding($text, 'UTF-8')) {
            throw MarkdownInvalid::encoding();
        }

        $text = str_replace(["\r\n", "\r"], "\n", $text);

        if (trim($text) === '') {
            throw ContentMissing::field('body');
        }

        if (strlen($text) > self::BODY_BYTES) {
            throw ContentTooLarge::field('body', self::BODY_BYTES.' bytes');
        }

        return new self($text, self::outlineOf($text));
    }

    /**
     * @throws ContentMissing|ContentTooLarge
     */
    public static function title(string $title): string
    {
        return self::line('title', $title, self::TITLE_CHARACTERS);
    }

    /**
     * @throws ContentMissing|ContentTooLarge
     */
    public static function abstract(string $abstract): string
    {
        return self::line('abstract', $abstract, self::ABSTRACT_CHARACTERS);
    }

    /**
     * @throws SectionMissing
     */
    public function section(int $number): Section
    {
        return $this->sections[$number - 1] ?? throw SectionMissing::number($number, count($this->sections));
    }

    /**
     * @return list<Section>
     */
    public function sectionsNamed(string $heading): array
    {
        return array_values(array_filter($this->sections, fn (Section $section) => strcasecmp($section->heading, trim($heading)) === 0));
    }

    /**
     * The section headed so, when exactly one is.
     *
     * @throws SectionMissing
     */
    public function sectionNamed(string $heading): Section
    {
        $named = $this->sectionsNamed($heading);

        return match (count($named)) {
            0 => throw SectionMissing::named($heading),
            1 => $named[0],
            default => throw SectionMissing::ambiguous($heading, array_map(fn (Section $section) => $section->number, $named)),
        };
    }

    /**
     * Each section as its number and heading, in order.
     *
     * @return list<string>
     */
    public function outline(): array
    {
        return array_map(fn (Section $section) => "{$section->number} {$section->heading}", $this->sections);
    }

    /**
     * The section a caller names, by its number or by its exact heading.
     *
     * @throws SectionMissing
     */
    public function sectionBy(string $numberOrHeading): Section
    {
        return ctype_digit($numberOrHeading) ? $this->section((int) $numberOrHeading) : $this->sectionNamed($numberOrHeading);
    }

    /**
     * The text with one section's lines replaced; the heading stays unless the new text starts with one of the same
     * level. Every other section is kept byte for byte.
     *
     * @throws SectionMissing|MarkdownInvalid|ContentMissing|ContentTooLarge
     */
    public function withSectionReplaced(int $number, string $text): self
    {
        $section = $this->section($number);
        $lines = explode("\n", $this->text);
        $replacement = explode("\n", str_replace(["\r\n", "\r"], "\n", rtrim($text, "\n")));
        $newLevel = self::headingLevel($replacement[0]);

        if ($section->level > 0 && $newLevel === 0) {
            $replacement = [$lines[$section->firstLine - 1], ...$replacement];
        }

        if ($section->level > 0 && $newLevel > 0 && $newLevel !== $section->level) {
            throw SectionMissing::levelChanged($number);
        }

        $replaced = array_slice($lines, $section->firstLine - 1, $section->lastLine - $section->firstLine + 1);
        $blankLinesAfter = count($replaced) - count(self::withoutTrailingBlankLines($replaced));
        array_splice($lines, $section->firstLine - 1, count($replaced), [...$replacement, ...array_fill(0, $blankLinesAfter, '')]);

        return self::body(implode("\n", $lines));
    }

    /**
     * The text with the section named by its number or exact heading replaced.
     *
     * @throws SectionMissing|MarkdownInvalid|ContentMissing|ContentTooLarge
     */
    public function withNamedSectionReplaced(string $numberOrHeading, string $text): self
    {
        return $this->withSectionReplaced($this->sectionBy($numberOrHeading)->number, $text);
    }

    /**
     * The text with one exact piece replaced; it must appear exactly once.
     *
     * @throws TextMatchInvalid|MarkdownInvalid|ContentMissing|ContentTooLarge
     */
    public function withTextReplaced(string $old, string $new): self
    {
        $count = substr_count($this->text, $old);

        if ($old === '' || $count !== 1) {
            throw TextMatchInvalid::count($count);
        }

        return self::body(str_replace($old, $new, $this->text));
    }

    /**
     * The lines from first to last, counted from 1.
     */
    public function lines(int $first, int $last): string
    {
        return implode("\n", array_slice(explode("\n", $this->text), $first - 1, $last - $first + 1));
    }

    /**
     * HTML that shows the text and runs nothing: raw HTML escaped, unsafe links dropped, images shown as links.
     */
    public function toSafeHtml(): string
    {
        $converter = new CommonMarkConverter(['html_input' => 'escape', 'allow_unsafe_links' => false]);
        $html = (string) $converter->convert($this->text);
        $html = (string) preg_replace('/<img src="([^"]*)" alt="([^"]*)"[^>]*>/', '<a href="$1" rel="noopener noreferrer">$2</a>', $html);

        return (string) preg_replace('/<a href="/', '<a rel="noopener noreferrer" href="', $html);
    }

    /**
     * @throws ContentMissing|ContentTooLarge
     */
    private static function line(string $field, string $value, int $maximum): string
    {
        $value = trim($value);

        if ($value === '') {
            throw ContentMissing::field($field);
        }

        if (str_contains($value, "\n") || str_contains($value, "\r")) {
            throw ContentTooLarge::lineBreak($field);
        }

        if (mb_strlen($value) > $maximum) {
            throw ContentTooLarge::field($field, "{$maximum} characters");
        }

        return $value;
    }

    /**
     * The lines without the blank lines that end them, which separate a section from the next or end the text.
     *
     * @param  list<string>  $lines
     * @return list<string>
     */
    private static function withoutTrailingBlankLines(array $lines): array
    {
        while ($lines !== [] && trim($lines[array_key_last($lines)]) === '') {
            array_pop($lines);
        }

        return $lines;
    }

    /**
     * The sections of the text: a preamble before the first heading, then one per ATX or setext heading outside
     * code fences, each running to the next heading of the same or a higher level.
     *
     * @return list<Section>
     *
     * @throws MarkdownInvalid
     */
    private static function outlineOf(string $text): array
    {
        $lines = explode("\n", $text);
        $headings = [];
        $fence = null;
        $fenceLine = 0;

        foreach ($lines as $index => $line) {
            if (preg_match('/^ {0,3}(`{3,}|~{3,})/', $line, $marker) === 1) {
                if ($fence === null) {
                    $fence = $marker[1][0];
                    $fenceLine = $index + 1;
                } elseif ($marker[1][0] === $fence) {
                    $fence = null;
                }

                continue;
            }

            if ($fence !== null) {
                continue;
            }

            $level = self::headingLevel($line);

            if ($level > 0) {
                $headings[] = [$index + 1, $level, trim((string) preg_replace('/^ {0,3}#{1,6}\s*|\s*#*\s*$/', '', $line))];

                continue;
            }

            $setext = preg_match('/^ {0,3}(=+|-+)\s*$/', $line, $underline) === 1 && $index > 0 && trim($lines[$index - 1]) !== '';

            if ($setext) {
                $headings[] = [$index, $underline[1][0] === '=' ? 1 : 2, trim($lines[$index - 1])];
            }
        }

        if ($fence !== null) {
            throw MarkdownInvalid::unclosedFence($fenceLine);
        }

        return self::sectionsFrom($headings, count($lines));
    }

    /**
     * @param  list<array{int, int, string}>  $headings  each heading's first line, level and text
     * @return list<Section>
     */
    private static function sectionsFrom(array $headings, int $lineCount): array
    {
        $sections = [];
        $firstHeadingLine = $headings[0][0] ?? $lineCount + 1;

        if ($firstHeadingLine > 1) {
            $sections[] = new Section(1, 0, '', 1, $firstHeadingLine - 1);
        }

        foreach ($headings as $position => [$line, $level, $heading]) {
            $end = $lineCount;

            foreach (array_slice($headings, $position + 1) as [$nextLine, $nextLevel]) {
                if ($nextLevel <= $level) {
                    $end = $nextLine - 1;

                    break;
                }
            }

            $sections[] = new Section(count($sections) + 1, $level, $heading, $line, $end);
        }

        return $sections;
    }

    private static function headingLevel(string $line): int
    {
        return preg_match('/^ {0,3}(#{1,6})(\s|$)/', $line, $hashes) === 1 ? strlen($hashes[1]) : 0;
    }
}
