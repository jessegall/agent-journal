<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\ContentMissing;
use App\Exceptions\ContentTooLarge;
use App\Exceptions\MarkdownInvalid;
use App\Exceptions\SectionMissing;
use App\Exceptions\TextLineTooLong;
use App\Exceptions\TextMatchInvalid;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Extension\CommonMark\Node\Block\IndentedCode;
use League\CommonMark\Extension\CommonMark\Node\Block\ListItem;
use League\CommonMark\MarkdownConverter;
use League\CommonMark\Node\Block\AbstractBlock;
use League\CommonMark\Node\Block\Document;
use League\CommonMark\Node\Block\Paragraph;

/**
 * The Markdown body of a document or report: checked when it is made, read by sections, and rendered to safe HTML.
 * Line endings become LF; every other character is kept as written.
 */
final readonly class MarkdownText
{
    public const int BODY_BYTES = 2_097_152;

    public const int COMMENT_BYTES = 16_384;

    /**
     * The blocks a rendered body marks with their source lines.
     */
    private const array MARKED_BLOCKS = [
        Heading::class,
        Paragraph::class,
        ListItem::class,
        FencedCode::class,
        IndentedCode::class,
    ];

    /**
     * @param  list<Section>  $sections
     */
    private function __construct(public string $text, public array $sections) {}

    /**
     * @throws MarkdownInvalid|ContentMissing|ContentTooLarge
     */
    public static function body(string $text): self
    {
        return self::parseBody($text, true);
    }

    public static function workingBody(string $text): self
    {
        return self::parseBody($text, false);
    }

    private static function parseBody(string $text, bool $isClosedFence): self
    {
        if (! mb_check_encoding($text, 'UTF-8')) {
            throw MarkdownInvalid::encoding();
        }

        $normalized = str_replace(["\r\n", "\r"], "\n", $text);

        if (trim($normalized) === '') {
            throw ContentMissing::field('body');
        }

        if (strlen($normalized) > self::BODY_BYTES) {
            throw ContentTooLarge::field('body', self::BODY_BYTES.' bytes');
        }

        return new self($normalized, self::outlineOf($normalized, $isClosedFence));
    }

    /**
     * A comment's text: valid UTF-8, not blank, at most COMMENT_BYTES long, with LF line ends.
     *
     * @throws MarkdownInvalid|ContentMissing|ContentTooLarge
     */
    public static function comment(string $text): string
    {
        if (! mb_check_encoding($text, 'UTF-8')) {
            throw MarkdownInvalid::encoding();
        }

        if (trim($text) === '') {
            throw ContentMissing::field('comment');
        }

        if (strlen($text) > self::COMMENT_BYTES) {
            throw ContentTooLarge::field('comment', self::COMMENT_BYTES.' bytes');
        }

        return str_replace(["\r\n", "\r"], "\n", $text);
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
        return array_values(
            array_filter($this->sections, fn (Section $section) => strcasecmp($section->heading, trim($heading)) === 0),
        );
    }

    /**
     * The sections reached by an exact heading path, such as ["Failure", "Retry"]: each heading nested under the one
     * before it. Headings inside code fences are no headings.
     *
     * @param  list<string>  $path
     * @return list<Section>
     */
    public function sectionsAtPath(array $path): array
    {
        $found = [];
        $open = [];

        foreach ($this->sections as $section) {
            if ($section->level === 0) {
                continue;
            }

            while ($open !== [] && $open[array_key_last($open)]->level >= $section->level) {
                array_pop($open);
            }

            $open[] = $section;

            if (array_map(fn (Section $heading) => $heading->heading, $open) === $path) {
                $found[] = $section;
            }
        }

        return $found;
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
            default => throw SectionMissing::ambiguous(
                $heading,
                array_map(fn (Section $section) => $section->number, $named),
            ),
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
     * Each section as its number, heading and line span, in order.
     *
     * @return list<string>
     */
    public function outlineWithLines(): array
    {
        return array_map(
            fn (
                Section $section,
            ) => "{$section->number} {$section->heading} (lines {$section->firstLine}-{$section->lastLine})",
            $this->sections,
        );
    }

    /**
     * The selected lines, cut at TextPart's bound unless the whole is asked for; bullets and word matches keep their
     * line numbers.
     *
     * @throws SectionMissing
     */
    public function part(TextSelection $selection): TextPart
    {
        $lines = explode("\n", $this->text);
        $section = $selection->section === null ? null : $this->sectionBy($selection->section);
        $first = $section->firstLine ?? $selection->firstLine ?? 1;
        $last = min(count($lines), $section->lastLine ?? $selection->lastLine ?? count($lines));
        $numbered = [];

        for ($number = $first; $number <= $last; $number++) {
            $line = $lines[$number - 1];

            $kept = (! $selection->bullets || preg_match('/^\s*([-*+]|\d+[.)])\s/', $line) === 1)
                && ($selection->words === null || mb_stripos($line, $selection->words) !== false);

            if ($kept) {
                $numbered[$number] = $selection->bullets || $selection->words !== null ? "{$number}: {$line}" : $line;
            }
        }

        return self::bounded($numbered, $first, $last, $selection->isWholeText);
    }

    /**
     * @param  array<int, string>  $numbered
     */
    private static function bounded(array $numbered, int $first, int $last, bool $isWholeText): TextPart
    {
        $taken = [];
        $bytes = 0;

        foreach ($numbered as $number => $line) {
            $full = ! $isWholeText
                && (count($taken) >= TextPart::LINES || $bytes + strlen($line) + 1 > TextPart::BYTES);

            if ($full && $taken === []) {
                throw TextLineTooLong::at($number, TextPart::BYTES);
            }

            if ($full) {
                return new TextPart(implode("\n", $taken), $first, $number - 1, $number);
            }

            $taken[] = $line;
            $bytes += strlen($line) + 1;
        }

        return new TextPart(implode("\n", $taken), $first, $last, null);
    }

    /**
     * The section a caller names, by its number or by its exact heading.
     *
     * @throws SectionMissing
     */
    public function sectionBy(string $numberOrHeading): Section
    {
        return ctype_digit($numberOrHeading) ? $this->section(
            (int) $numberOrHeading,
        ) : $this->sectionNamed($numberOrHeading);
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

        array_splice(
            $lines,
            $section->firstLine - 1,
            count($replaced),
            [...$replacement, ...array_fill(0, $blankLinesAfter, '')],
        );

        return self::workingBody(implode("\n", $lines));
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

        return self::workingBody(str_replace($old, $new, $this->text));
    }

    /**
     * The lines from first to last, counted from 1.
     */
    public function lines(int $first, int $last): string
    {
        return implode("\n", array_slice(explode("\n", $this->text), $first - 1, $last - $first + 1));
    }

    /**
     * HTML that shows the text and runs nothing: raw HTML escaped, unsafe links dropped, images shown as links. Each
     * heading, paragraph, list item and code block carries the source lines it came from, counted from the first line.
     */
    public function toSafeHtml(int $firstLine = 1): string
    {
        return self::rendered($this->text, $firstLine);
    }

    /**
     * HTML for any Markdown text, such as a comment, made safe the same way as a body, without source lines.
     */
    public static function safeHtmlOf(string $text): string
    {
        return self::rendered($text, null);
    }

    /**
     * HTML for text shown to the public through a share: safe as any body, and with every link that does not leave for
     * an http or https address shown as its plain text, since no server-approved path stands behind it.
     */
    public static function publicHtmlOf(string $text): string
    {
        return (string) preg_replace_callback(
            '/<a rel="noopener noreferrer" href="([^"]*)">(.*?)<\/a>/s',
            fn (array $link) => preg_match('/^https?:\/\//i', html_entity_decode($link[1])) === 1 ? $link[0] : $link[2],
            self::rendered($text, null),
        );
    }

    /**
     * Renders safely; with a first line, each block is marked with its source lines after that offset. Raw HTML is
     * escaped, so an author can never write these marks.
     */
    private static function rendered(string $text, int|null $firstLine): string
    {
        $environment = new Environment(['html_input' => 'escape', 'allow_unsafe_links' => false]);
        $environment->addExtension(new CommonMarkCoreExtension());

        if ($firstLine !== null) {
            $environment->addEventListener(
                DocumentParsedEvent::class,
                fn (DocumentParsedEvent $event) => self::markSourceLines($event->getDocument(), $firstLine),
            );
        }

        $html = (string) new MarkdownConverter($environment)->convert($text);

        $html = (string) preg_replace(
            '/<img src="([^"]*)" alt="([^"]*)"[^>]*>/',
            '<a href="$1" rel="noopener noreferrer">$2</a>',
            $html,
        );

        return (string) preg_replace('/<a href="/', '<a rel="noopener noreferrer" href="', $html);
    }

    /**
     * Gives every marked block its first and last source line, shifted so the text's own first line is firstLine.
     */
    private static function markSourceLines(Document $document, int $firstLine): void
    {
        foreach ($document->iterator() as $node) {
            if (! in_array($node::class, self::MARKED_BLOCKS, true)
                || ! $node instanceof AbstractBlock
                || $node->getStartLine() === null
                || $node->getEndLine() === null) {
                continue;
            }

            $node->data->set('attributes/data-source-first', (string) ($node->getStartLine() + $firstLine - 1));
            $node->data->set('attributes/data-source-last', (string) ($node->getEndLine() + $firstLine - 1));
        }
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
    private static function outlineOf(string $text, bool $closedFence): array
    {
        $lines = explode("\n", $text);
        $headings = [];
        $fence = null;
        $fenceLine = 0;

        foreach ($lines as $index => $line) {
            if (preg_match('/^ {0,3}(`{3,}|~{3,})(.*)$/', $line, $marker) === 1) {
                if ($fence === null) {
                    $fence = $marker[1];
                    $fenceLine = $index + 1;
                } elseif (str_starts_with($marker[1], $fence) && trim($marker[2]) === '') {
                    $fence = null;
                }

                continue;
            }

            if ($fence !== null) {
                continue;
            }

            $level = self::headingLevel($line);

            if ($level > 0) {
                $headings[] = [
                    $index + 1,
                    $level,
                    trim((string) preg_replace('/^ {0,3}#{1,6}\s*|\s*#*\s*$/', '', $line)),
                ];

                continue;
            }

            $setext = preg_match(
                '/^ {0,3}(=+|-+)\s*$/',
                $line,
                $underline,
            ) === 1 && $index > 0 && trim($lines[$index - 1]) !== '';

            if ($setext) {
                $headings[] = [$index, $underline[1][0] === '=' ? 1 : 2, trim($lines[$index - 1])];
            }
        }

        if ($closedFence && $fence !== null) {
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
            $sections[] = Section::preamble($firstHeadingLine - 1);
        }

        $ends = [];
        $next = array_fill(0, 6, $lineCount + 1);

        foreach (array_reverse($headings, true) as $position => [$line, $level]) {
            $ends[$position] = min($lineCount + 1, ...array_slice($next, 0, $level)) - 1;
            $next[$level - 1] = $line;
        }

        foreach ($headings as $position => [$line, $level, $heading]) {
            $sections[] = new Section(count($sections) + 1, $level, $heading, $line, $ends[$position]);
        }

        return $sections;
    }

    private static function headingLevel(string $line): int
    {
        return preg_match('/^ {0,3}(#{1,6})(\s|$)/', $line, $hashes) === 1 ? strlen($hashes[1]) : 0;
    }
}
