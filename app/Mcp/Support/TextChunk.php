<?php

declare(strict_types=1);

namespace App\Mcp\Support;

/**
 * One chunk of a text body: at most 80 lines or 4 KiB, starting at a line and a character offset inside it. A line
 * longer than the chunk is cut between Unicode characters, never inside one, and offsets count characters.
 */
final readonly class TextChunk
{
    public const int MAX_LINES = 80;

    public const int MAX_BYTES = 4096;

    private const string ENCODING = 'UTF-8';

    /**
     * @param  int  $lineStart  the first line, counted from 1
     * @param  int  $nextLine  the line the next chunk starts at
     * @param  int  $nextCharacter  the character offset in that line the next chunk starts at
     */
    private function __construct(
        public string $text,
        public int $lineStart,
        public int $characterStart,
        public int $nextLine,
        public int $nextCharacter,
        public bool $hasMore,
    ) {}

    /**
     * The chunk of the text from the line and character offset given.
     */
    public static function of(string $text, int $lineStart, int $characterStart): self
    {
        $lines = explode("\n", $text);
        $parts = [];
        $bytes = 0;
        $line = $lineStart;
        $character = $characterStart;

        while ($line <= count($lines) && count($parts) < self::MAX_LINES) {
            $rest = mb_substr($lines[$line - 1], $character, null, self::ENCODING);
            $room = self::MAX_BYTES - $bytes;

            if (strlen($rest) > $room) {
                $part = mb_strcut($rest, 0, $room, self::ENCODING);
                $parts[] = $part;

                return new self(
                    implode("\n", $parts),
                    $lineStart,
                    $characterStart,
                    $line,
                    $character + mb_strlen($part, self::ENCODING),
                    true,
                );
            }

            $parts[] = $rest;
            $bytes += strlen($rest) + 1;
            $line++;
            $character = 0;
        }

        return new self(implode("\n", $parts), $lineStart, $characterStart, $line, 0, $line <= count($lines));
    }
}
