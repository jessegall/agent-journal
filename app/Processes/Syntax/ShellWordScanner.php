<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\TokenType;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Exceptions\ShellLineUnreadable;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;
use App\Processes\Values\WordSegment;

/**
 * Reads one shell word, preserving its quoting, escapes and expansions.
 */
final readonly class ShellWordScanner
{
    private const string WORD_ENDS = " \t\n;&|<>()";

    public function __construct(private ShellExpansionScanner $expansions) {}

    public function read(LexerCursor $cursor): void
    {
        $start = $cursor->position;

        if (substr($cursor->source, $start, 3) === '[[ '
            && $cursor->dialect !== ShellDialect::Sh
            && $cursor->atCommandStart()) {
            $this->readConditionalExpression($cursor, $start);

            return;
        }

        $word = $this->readWord($cursor);

        $cursor->hereDocuments->takeDelimiter(count($cursor->tokens()) - 1);

        $literal = $word->literal();
        $isPlain = count($word->segments) === 1 && $word->segments[0]->type === WordSegmentType::Literal;
        $type = match (true) {
            $isPlain && $literal === '{' => TokenType::OpenBrace,
            $isPlain && $literal === '}' => TokenType::CloseBrace,
            default => TokenType::Word,
        };
        $cursor->append(new Token($type, new SourceRange($start, $cursor->position), word: $word));
    }

    /**
     * Reads one word up to an unquoted separator, as its segments in order.
     *
     * @throws ShellLineUnreadable
     */
    private function readWord(LexerCursor $cursor): Word
    {
        $start = $cursor->position;
        $word = new WordBuilder();
        $length = strlen($cursor->source);
        $extended = $cursor->dialect !== ShellDialect::Sh;

        while ($cursor->position < $length) {
            $cursor->assertWithinBudget();
            $character = $cursor->source[$cursor->position];

            if ($extended
                && ($character === '<' || $character === '>')
                && $cursor->at($cursor->position + 1) === '('
                && $cursor->position === $start) {
                $word->add(
                    $cursor->position,
                    $this->expansions->readBalanced($cursor, 'a process substitution'),
                );

                continue;
            }

            if (str_contains(self::WORD_ENDS, $character)) {
                break;
            }

            match (true) {
                $character === '\\' => $this->readEscape($cursor, $word),
                $character === "'" => $word->add($cursor->position, $this->readSingleQuoted($cursor)),
                $character === '"' => $word->add($cursor->position, ...$this->readDoubleQuoted($cursor)),
                $character === '$' || $character === '`' => $this->readExpansionOrDollar($cursor, $word, $character),
                default => $word->addCharacter($character, $cursor->position++),
            };
        }

        return $word->word(new SourceRange($start, $cursor->position));
    }

    /**
     * Reads a backslash and the character it escapes, or skips a backslash-newline, which only continues the line.
     */
    private function readEscape(LexerCursor $cursor, WordBuilder $word): void
    {
        if ($cursor->at($cursor->position + 1) === "\n") {
            $cursor->position += 2;

            return;
        }

        $escapeStart = $cursor->position;
        $cursor->position += min(2, strlen($cursor->source) - $cursor->position);
        $word->add(
            $escapeStart,
            new WordSegment(
                WordSegmentType::Escaped,
                substr($cursor->source, $escapeStart + 1, $cursor->position - $escapeStart - 1),
                new SourceRange($escapeStart, $cursor->position),
            ),
        );
    }

    /**
     * @throws ShellLineUnreadable
     */
    private function readSingleQuoted(LexerCursor $cursor): WordSegment
    {
        $close = strpos($cursor->source, "'", $cursor->position + 1);

        if ($close === false) {
            throw ShellLineUnreadable::unfinished('a single-quoted string', $cursor->position);
        }

        $segment = new WordSegment(
            WordSegmentType::SingleQuoted,
            substr($cursor->source, $cursor->position + 1, $close - $cursor->position - 1),
            new SourceRange($cursor->position, $close + 1),
        );
        $cursor->position = $close + 1;

        return $segment;
    }

    /**
     * Reads the expansion a $ or backtick starts; a $ that starts none is a plain character of the word.
     *
     * @throws ShellLineUnreadable
     */
    private function readExpansionOrDollar(LexerCursor $cursor, WordBuilder $word, string $character): void
    {
        $expansion = $this->expansions->read($cursor);

        if ($expansion === null) {
            $word->addCharacter($character, $cursor->position++);

            return;
        }

        $word->add($expansion->range->start, $expansion);
    }

    /**
     * Reads [[ ... ]] as one literal word, including operators and parentheses inside the test.
     *
     * @throws ShellLineUnreadable
     */
    private function readConditionalExpression(LexerCursor $cursor, int $start): void
    {
        $index = $start + 3;
        $length = strlen($cursor->source);

        while ($index < $length) {
            $cursor->assertWithinBudget();
            $character = $cursor->source[$index];

            if ($character === '\\') {
                $index += 2;

                continue;
            }

            if ($character === "'") {
                $close = strpos($cursor->source, "'", $index + 1);

                if ($close === false) {
                    throw ShellLineUnreadable::unfinished('a single-quoted string', $index);
                }

                $index = $close + 1;

                continue;
            }

            if ($character === '"' || $character === '`') {
                $close = $this->expansions->closingQuote($cursor, $character, $index + 1, $index, 'a quoted string');
                $index = $close + 1;

                continue;
            }

            $closes = $character === ']' && $cursor->at($index + 1) === ']' && in_array(
                $cursor->source[$index - 1],
                [' ', "\t"],
                true,
            )
                && in_array($cursor->at($index + 2), ['', ' ', "\t", "\n", ';', '&', '|', ')'], true);

            if ($closes) {
                $cursor->emitLiteralWord($start, $index + 2);

                return;
            }

            $index++;
        }

        throw ShellLineUnreadable::unfinished('a [[ ]] test', $start);
    }

    /**
     * Reads a double-quoted string as quoted text pieces and the expansions between them; "" is one empty piece.
     *
     * @return list<WordSegment>
     *
     * @throws ShellLineUnreadable
     */
    private function readDoubleQuoted(LexerCursor $cursor): array
    {
        $open = $cursor->position;
        $cursor->position++;
        $segments = [];
        $text = '';
        $textStart = $cursor->position;
        $length = strlen($cursor->source);

        while (true) {
            $cursor->assertWithinBudget();

            if ($cursor->position >= $length) {
                throw ShellLineUnreadable::unfinished('a double-quoted string', $open);
            }

            $character = $cursor->source[$cursor->position];

            if ($character === '"') {
                break;
            }

            $next = $cursor->at($cursor->position + 1);

            if ($character === '\\' && in_array($next, ['$', '`', '"', '\\', "\n"], true)) {
                if ($next !== "\n") {
                    $text .= $next;
                }

                $cursor->position += 2;

                continue;
            }

            $startsExpansion = ($character === '$' && $next !== "'") || $character === '`';
            $expansion = $startsExpansion ? $this->expansions->read($cursor) : null;

            if ($expansion !== null) {
                if ($text !== '') {
                    $segments[] = new WordSegment(
                        WordSegmentType::DoubleQuoted,
                        $text,
                        new SourceRange($textStart, $expansion->range->start),
                    );
                }

                $segments[] = $expansion;
                $text = '';
                $textStart = $cursor->position;

                continue;
            }

            $text .= $character;
            $cursor->position++;
        }

        if ($text !== '' || $segments === []) {
            $segments[] = new WordSegment(
                WordSegmentType::DoubleQuoted,
                $text,
                new SourceRange($segments === [] ? $open : $textStart, $cursor->position + 1),
            );
        }

        $cursor->position++;

        return $segments;
    }
}
