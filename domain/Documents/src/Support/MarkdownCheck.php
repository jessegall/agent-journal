<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Exceptions\MarkdownInvalid;
use App\Support\MarkdownText;
use Domain\Documents\Exceptions\DraftMarkdownInvalid;

final class MarkdownCheck
{
    public static function publication(string $text): MarkdownText
    {
        try {
            $body = MarkdownText::body($text);
        } catch (MarkdownInvalid $markdownIssue) {
            throw DraftMarkdownInvalid::fromBody($markdownIssue);
        }

        $problems = self::problemLines(explode("\n", $body->text));

        if ($problems !== []) {
            throw DraftMarkdownInvalid::onLines($problems);
        }

        return $body;
    }

    /**
     * @param  list<string>  $lines
     * @return list<int>
     */
    private static function problemLines(array $lines): array
    {
        $problems = [];
        $fence = '';
        $headingLevel = 0;
        $columns = 0;

        foreach ($lines as $index => $line) {
            if ($fence !== '') {
                if (str_starts_with(ltrim($line), $fence) && trim($line, " `~\t") === '') {
                    $fence = '';
                }

                continue;
            }

            if (preg_match('/^ {0,3}(`{3,}|~{3,})/', $line, $marker) === 1) {
                $fence = $marker[1];
                $columns = 0;

                continue;
            }

            if (substr_count(str_replace('\`', '', $line), '`') === 1) {
                $problems[] = $index + 1;
            }

            $next = $lines[$index + 1] ?? '';

            if (self::hasTableCells($line, $next, $columns)) {
                $cells = count(self::cells($line));

                if (! self::validTableLine($cells, $next, $columns)) {
                    $problems[] = $index + 1;
                }

                if ($columns === 0 && self::isTableSeparator($next)) {
                    $columns = $cells;
                }

                continue;
            }

            $columns = 0;

            if (preg_match('/^ {0,3}(#{1,6})(.*)$/', $line, $heading) === 1) {
                $level = strlen($heading[1]);

                if ($level > $headingLevel + 1 || ($heading[2] !== '' && ! ctype_space($heading[2][0]))) {
                    $problems[] = $index + 1;
                }

                $headingLevel = $level;
            }
        }

        return array_values(array_unique($problems));
    }

    private static function hasTableCells(string $line, string $next, int $columns): bool
    {
        return str_contains($line, '|')
            && ($columns > 0 || str_starts_with(ltrim($line), '|') || self::isTableSeparator($next));
    }

    private static function validTableLine(int $cells, string $next, int $columns): bool
    {
        return $columns === 0 ? self::isTableSeparator($next) : $cells === $columns;
    }

    private static function isTableSeparator(string $line): bool
    {
        if (! str_contains($line, '|')) {
            return false;
        }

        foreach (self::cells($line) as $cell) {
            if (preg_match('/^:?-{3,}:?$/', trim($cell)) !== 1) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return list<string>
     */
    private static function cells(string $line): array
    {
        return preg_split('/(?<!\\\\)\|/', trim(trim($line), '|')) ?: [''];
    }
}
