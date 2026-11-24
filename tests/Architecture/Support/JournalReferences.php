<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * Finds comments that point at this project's own journal records, such as a rule, a task, a document section or a
 * user's message by number, which nobody else who opens the code can read. A record named as an example of what the
 * journal shows, such as task 7, is the product speaking and is left alone.
 */
final readonly class JournalReferences
{
    private const string REFERENCE = '/\buser\s+\d{4,}|\b(?:rules?|user messages?|messages?|tasks?|docs?|documents?'
        .'|reports?|plans?|phases?|questions?|memor(?:y|ies)|decisions?)\s+\d+|\breports? of \d+/i';

    private const string EXAMPLE = '/such as|like|e\.g\.|example|users name|users refer|how users|labelled|test user'
        .'|within|named as/i';

    private const string PHP_COMMENT = '~/\*.*?\*/|//[^\n]*|#(?!\[)[^\n]*~s';

    private const string LINE_COMMENT = '~(?:#|//|<!--|^\s*\*)\s.*~';

    /**
     * Each reference in the file's comments, as path:line.
     *
     * @return list<string>
     */
    public static function in(string $path, string $source): array
    {
        $found = [];

        foreach (self::comments($path, $source) as [$line, $comment]) {
            preg_match_all(self::REFERENCE, $comment, $matches, PREG_OFFSET_CAPTURE);

            foreach ($matches[0] as [$text, $offset]) {
                $before = substr($comment, max(0, $offset - 40), min($offset, 40));

                $isExample = preg_match(self::EXAMPLE, $before) === 1 || preg_match("/(?:'s|')\s*$/", $before) === 1;

                if (! $isExample) {
                    $found[] = $path.':'.($line + substr_count($comment, "\n", 0, $offset));
                }
            }
        }

        return $found;
    }

    /**
     * @return list<array{int, string}>
     */
    private static function comments(string $path, string $source): array
    {
        if (str_ends_with($path, '.php')) {
            preg_match_all(self::PHP_COMMENT, $source, $matches, PREG_OFFSET_CAPTURE);

            return array_map(
                fn (array $match) => [substr_count($source, "\n", 0, $match[1]) + 1, $match[0]],
                $matches[0],
            );
        }

        $comments = [];

        foreach (explode("\n", $source) as $index => $line) {
            if (preg_match(self::LINE_COMMENT, $line, $match) === 1) {
                $comments[] = [$index + 1, $match[0]];
            }
        }

        return $comments;
    }
}
