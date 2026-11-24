<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Data\DocumentBlockData;
use Domain\Documents\Enums\DocumentBlockType;

/**
 * A document's Markdown read into the blocks the reader draws: a fenced code block is one block with its fences, a
 * line starting with one to three # is a heading, a line starting with "- " a list item, and any other line that is
 * not blank a paragraph. Each block keeps the lines it was read from.
 */
final readonly class MarkdownBlocks
{
    private const string FENCE = '```';

    /**
     * @return list<DocumentBlockData>
     */
    public static function of(string $body): array
    {
        $lines = explode("\n", $body);
        $blocks = [];
        $index = 0;

        while ($index < count($lines)) {
            $line = $lines[$index];

            if (str_starts_with($line, self::FENCE)) {
                $end = self::fenceEnd($lines, $index);
                $code = implode("\n", array_slice($lines, $index + 1, max(0, $end - $index - 1)));
                $blocks[] = new DocumentBlockData(DocumentBlockType::Code, $code, $index + 1, $end + 1);
                $index = $end + 1;

                continue;
            }

            if (trim($line) !== '') {
                $blocks[] = self::lineBlock($line, $index + 1);
            }

            $index++;
        }

        return $blocks;
    }

    /**
     * The index of the line that closes the fence opened at the given line, or the last line when none closes it.
     *
     * @param  list<string>  $lines
     */
    private static function fenceEnd(array $lines, int $opening): int
    {
        for ($index = $opening + 1; $index < count($lines); $index++) {
            if (str_starts_with($lines[$index], self::FENCE)) {
                return $index;
            }
        }

        return count($lines) - 1;
    }

    private static function lineBlock(string $line, int $number): DocumentBlockData
    {
        if (preg_match('/^#{1,3} (.*)$/', $line, $heading) === 1) {
            return new DocumentBlockData(DocumentBlockType::Heading, $heading[1], $number, $number);
        }

        if (str_starts_with($line, '- ')) {
            return new DocumentBlockData(DocumentBlockType::Item, substr($line, 2), $number, $number);
        }

        return new DocumentBlockData(DocumentBlockType::Paragraph, $line, $number, $number);
    }
}
