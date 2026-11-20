<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Exceptions\ShellLineUnreadable;
use App\Processes\Values\SourceRange;
use App\Processes\Values\WordSegment;

/**
 * Reads expansions through their closing character, including nested shell constructs.
 */
final readonly class ShellExpansionScanner
{
    /**
     * Reads $(...), $((...)), `...`, ${...} or $NAME at the position as one expansion; a lone $ answers null.
     *
     * @throws ShellLineUnreadable
     */
    public function read(LexerCursor $cursor): WordSegment|null
    {
        $start = $cursor->position;
        if ($cursor->source[$start] === '`') {
            $close = $start + 1;
            while (true) {
                $close = strpos($cursor->source, '`', $close);
                if ($close === false) {
                    throw ShellLineUnreadable::unfinished('a backtick substitution', $start);
                }
                if ($cursor->source[$close - 1] !== '\\') {
                    break;
                }
                $close++;
            }
            $cursor->position = $close + 1;

            return new WordSegment(
                WordSegmentType::Expansion,
                substr($cursor->source, $start + 1, $close - $start - 1),
                new SourceRange($start, $cursor->position),
            );
        }

        $next = $cursor->at($start + 1);
        if ($next === "'" && $cursor->dialect !== ShellDialect::Sh) {
            $close = $this->closingQuote($cursor, "'", $start + 2, $start, 'an ANSI-C quoted string');
            $cursor->position = $close + 1;

            return new WordSegment(
                WordSegmentType::SingleQuoted,
                stripcslashes(substr($cursor->source, $start + 2, $close - $start - 2)),
                new SourceRange($start, $cursor->position),
            );
        }
        if ($next === '(') {
            return $this->readBalanced($cursor, 'a command substitution');
        }
        if ($next === '{') {
            $nameStart = $cursor->at($start + 2);
            $zshFlags = $cursor->dialect === ShellDialect::Zsh && $nameStart === '(';
            if ($nameStart === '' || ! ($zshFlags || ctype_alnum($nameStart) || str_contains('_@*#?$!-', $nameStart))) {
                throw ShellLineUnreadable::badSubstitution($start);
            }
            $cursor->position = $this->closingBrace($cursor, $start) + 1;

            return new WordSegment(
                WordSegmentType::Expansion,
                substr($cursor->source, $start, $cursor->position - $start),
                new SourceRange($start, $cursor->position),
            );
        }
        $nameLength = strspn(
            $cursor->source,
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_',
            $start + 1,
        );
        if ($nameLength === 0 && $next !== '' && str_contains('@*#?$!-0123456789', $next)) {
            $nameLength = 1;
        }
        if ($nameLength === 0) {
            return null;
        }
        $cursor->position = $start + 1 + $nameLength;

        return new WordSegment(
            WordSegmentType::Expansion,
            substr($cursor->source, $start, $cursor->position - $start),
            new SourceRange($start, $cursor->position),
        );
    }

    /**
     * Reads up to the parenthesis that closes the one before $contentStart, past quotes and nested parentheses; the
     * segment's text is the source inside, which the parser reads as its own line.
     *
     * @throws ShellLineUnreadable
     */
    public function readBalanced(LexerCursor $cursor, string $what): WordSegment
    {
        $start = $cursor->position;
        $contentStart = $start + 2;
        $depth = 1;
        $index = $contentStart;
        $length = strlen($cursor->source);
        while ($index < $length) {
            $cursor->assertWithinBudget();
            $character = $cursor->source[$index];
            if ($character === '\\') {
                $index += 2;

                continue;
            }
            if ($character === '$' && $cursor->at($index + 1) === "'") {
                $index = $this->closingQuote($cursor, "'", $index + 2, $start, $what) + 1;

                continue;
            }
            if ($character === "'") {
                $close = strpos($cursor->source, "'", $index + 1);
                if ($close === false) {
                    throw ShellLineUnreadable::unfinished($what, $start);
                }
                $index = $close + 1;

                continue;
            }
            if ($character === '"' || $character === '`') {
                $index = $this->closingQuote($cursor, $character, $index + 1, $start, $what) + 1;

                continue;
            }
            if ($character === '<' && $cursor->at($index + 1) === '<' && $cursor->at($index + 2) === '<') {
                $index += 3;

                continue;
            }
            if ($character === '<' && $cursor->at($index + 1) === '<') {
                $index = $this->pastNestedHereDocument($cursor, $index, $start, $what);

                continue;
            }
            if ($character === 'c' && $this->startsWord($cursor, $index, 'case')) {
                $index = $this->pastNestedCase($cursor, $index, $start, $what);

                continue;
            }
            if ($character === '(') {
                $depth++;
            } elseif ($character === ')' && --$depth === 0) {
                $cursor->position = $index + 1;

                return new WordSegment(
                    WordSegmentType::Expansion,
                    substr($cursor->source, $contentStart, $index - $contentStart),
                    new SourceRange($start, $cursor->position),
                );
            }
            $index++;
        }

        throw ShellLineUnreadable::unfinished($what, $start);
    }

    /**
     * The position of the brace that closes a ${ parameter expansion, past nested braces, quotes and substitutions.
     *
     * @throws ShellLineUnreadable
     */
    private function closingBrace(LexerCursor $cursor, int $start): int
    {
        $depth = 1;
        $index = $start + 2;
        $length = strlen($cursor->source);
        while ($index < $length) {
            $character = $cursor->source[$index];
            if ($character === '\\') {
                $index += 2;

                continue;
            }
            if ($character === "'" || $character === '"' || $character === '`') {
                $index = $this->closingQuote($cursor, $character, $index + 1, $start, 'a parameter expansion') + 1;

                continue;
            }
            if ($character === '$' && $cursor->at($index + 1) === '(') {
                $index = $this->endOfBalanced($cursor, $index);

                continue;
            }
            if ($character === '{') {
                $depth++;
            } elseif ($character === '}' && --$depth === 0) {
                return $index;
            }
            $index++;
        }

        throw ShellLineUnreadable::unfinished('a parameter expansion', $start);
    }

    /**
     * The position just past the $( ) that starts at the index, read by a scan of its own so this scan keeps its place.
     *
     * @throws ShellLineUnreadable
     */
    private function endOfBalanced(LexerCursor $cursor, int $index): int
    {
        $inner = $cursor->fork();
        $inner->position = $index;
        $this->readBalanced($inner, 'a command substitution');

        return $inner->position;
    }

    /**
     * The position of the quote that closes the single or double quote at the index.
     *
     * @throws ShellLineUnreadable
     */
    private function closingQuoteOf(LexerCursor $cursor, string $quote, int $index, int $start, string $what): int
    {
        if ($quote === '"') {
            return $this->closingQuote($cursor, '"', $index + 1, $start, $what);
        }
        $close = strpos($cursor->source, "'", $index + 1);
        if ($close === false) {
            throw ShellLineUnreadable::unfinished($what, $start);
        }

        return $close;
    }

    /**
     * The position of the quote that closes a double-quoted or backtick string, past backslash escapes.
     *
     * @throws ShellLineUnreadable
     */
    public function closingQuote(LexerCursor $cursor, string $quote, int $index, int $start, string $what): int
    {
        $position = $index;
        $length = strlen($cursor->source);
        while ($position < $length) {
            if ($cursor->source[$position] === '\\') {
                $position += 2;

                continue;
            }
            if ($cursor->source[$position] === $quote) {
                return $position;
            }
            $position++;
        }

        throw ShellLineUnreadable::unfinished($what, $start);
    }

    /**
     * Whether the word at the index is exactly this keyword, standing on its own.
     */
    private function startsWord(LexerCursor $cursor, int $index, string $keyword): bool
    {
        $before = $index === 0 ? ' ' : $cursor->source[$index - 1];
        $after = $cursor->at($index + strlen($keyword));

        return substr_compare($cursor->source, $keyword, $index, strlen($keyword)) === 0
            && str_contains(" \t\n;&|(", $before) && ($after === '' || str_contains(" \t\n;", $after));
    }

    /**
     * Inside a substitution, skips a case statement up to its esac, so the closing parenthesis of each pattern does
     * not close the substitution.
     *
     * @throws ShellLineUnreadable
     */
    private function pastNestedCase(LexerCursor $cursor, int $index, int $start, string $what): int
    {
        $position = $index;
        $depth = 0;
        $length = strlen($cursor->source);
        while ($position < $length) {
            $character = $cursor->source[$position];
            if ($character === "'" || $character === '"') {
                $position = $this->closingQuoteOf($cursor, $character, $position, $start, $what) + 1;

                continue;
            }
            if ($this->startsWord($cursor, $position, 'case')) {
                $depth++;
                $position += 4;

                continue;
            }
            $isBareEsac = $this->startsWord($cursor, $position, 'esa') === false
                && substr_compare($cursor->source, 'esac', $position, 4) === 0
                && in_array($cursor->at($position + 4), ['', ')', ' ', ';', "\n"], true)
                && str_contains(" \t\n;", $cursor->source[$position - 1] ?? ' ');

            if ($this->startsWord($cursor, $position, 'esac') || $isBareEsac) {
                if (--$depth === 0) {
                    return $position + 4;
                }
                $position += 4;

                continue;
            }
            $position++;
        }

        throw ShellLineUnreadable::unfinished($what, $start);
    }

    /**
     * Inside a substitution, skips a here-document: its operator and delimiter, the rest of its line, and its body up
     * to the delimiter line, so quotes and parentheses in the body do not count.
     *
     * @throws ShellLineUnreadable
     */
    private function pastNestedHereDocument(LexerCursor $cursor, int $index, int $start, string $what): int
    {
        $delimiterStart = $index + 2;
        $stripsTabs = $cursor->at($delimiterStart) === '-';
        $delimiterStart += $stripsTabs ? 1 : 0;
        $delimiterStart += strspn($cursor->source, " \t", $delimiterStart);
        $delimiterLength = strcspn($cursor->source, " \t\n;&|<>()", $delimiterStart);
        $delimiter = str_replace(["'", '"', '\\'], '', substr($cursor->source, $delimiterStart, $delimiterLength));
        if ($delimiter === '') {
            return $index + 2;
        }
        $lineEnd = strpos($cursor->source, "\n", $delimiterStart);
        if ($lineEnd === false) {
            return $delimiterStart + $delimiterLength;
        }
        $lineStart = $lineEnd + 1;
        $length = strlen($cursor->source);
        while ($lineStart <= $length) {
            $next = strpos($cursor->source, "\n", $lineStart);
            $next = $next === false ? $length : $next;
            $line = substr($cursor->source, $lineStart, $next - $lineStart);
            if (($stripsTabs ? ltrim($line, "\t") : $line) === $delimiter) {
                return $next;
            }
            if ($next === $length) {
                break;
            }
            $lineStart = $next + 1;
        }

        throw ShellLineUnreadable::unfinished($what, $start);
    }
}
