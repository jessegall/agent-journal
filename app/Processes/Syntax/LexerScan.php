<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\TokenType;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Exceptions\ShellLineUnreadable;
use App\Processes\Values\HereDocument;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;
use App\Processes\Values\WordSegment;

/**
 * One pass over one line: the position, the tokens so far and the here-documents still waiting for their bodies.
 */
final class LexerScan
{
    private const string WORD_ENDS = " \t\n;&|<>()";

    private int $position = 0;

    /**
     * @var list<Token>
     */
    private array $tokens = [];

    private readonly HereDocumentQueue $hereDocuments;

    private int $steps = 0;

    public function __construct(
        private readonly string $source,
        private readonly ShellDialect $dialect,
        private readonly TimeBudget $budget,
    ) {
        $this->hereDocuments = new HereDocumentQueue();
    }

    /**
     * @return list<Token>
     *
     * @throws ShellLineUnreadable
     */
    public function tokens(): array
    {
        $length = strlen($this->source);
        while ($this->position < $length) {
            $this->checkBudget();
            $character = $this->source[$this->position];

            match (true) {
                $character === ' ' || $character === "\t" => $this->position++,
                $character === '\\' && $this->at($this->position + 1) === "\n" => $this->position += 2,
                $character === "\n" => $this->readNewline(),
                $character === '#' => $this->readComment(),
                default => $this->readOperatorOrWord(),
            };
        }

        if ($this->hereDocuments->hasWaiting()) {
            $this->readHereDocumentBodies();
        }

        return $this->tokens;
    }

    /**
     * @throws ShellLineUnreadable
     */
    private function readNewline(): void
    {
        $this->emit(TokenType::Newline, $this->position, $this->position + 1);
        $this->position++;
        $this->readHereDocumentBodies();
    }

    private function readComment(): void
    {
        $end = strpos($this->source, "\n", $this->position);
        $end = $end === false ? strlen($this->source) : $end;
        $this->emit(TokenType::Comment, $this->position, $end);
        $this->position = $end;
    }

    /**
     * @throws ShellLineUnreadable
     */
    private function readOperatorOrWord(): void
    {
        if (! $this->readOperator()) {
            $this->readWordToken();
        }
    }

    /**
     * Reads an operator or a redirect at the position; answers false when a word starts here instead.
     */
    private function readOperator(): bool
    {
        $start = $this->position;
        $extended = $this->dialect !== ShellDialect::Sh;
        $digits = strspn($this->source, '0123456789', $start);
        $afterDigits = $this->at($start + $digits);

        if (($afterDigits === '<' || $afterDigits === '>')
            && ! ($extended && $this->at($start + $digits + 1) === '(' && $digits === 0)) {
            return $this->readRedirect($start, $digits);
        }
        if ($digits > 0) {
            return false;
        }

        if ($this->source[$start] === '(' && $this->at($start + 1) === '(' && $this->atCommandStart()) {
            $this->readArithmeticCommand($start);

            return true;
        }

        foreach ($this->operators($extended) as $text => $type) {
            if (substr_compare($this->source, $text, $start, strlen($text)) === 0) {
                if ($type === TokenType::Bang
                    && (! $this->atCommandStart() || ! in_array($this->at($start + 1), [' ', "\t", "\n", ''], true))) {
                    return false;
                }
                if ($text === '&>' || $text === '&>>') {
                    $this->position += strlen($text);
                    $this->emitRedirect($text === '&>>' ? RedirectType::Append : RedirectType::Output, 1, $start);

                    return true;
                }
                $this->emit($type, $start, $start + strlen($text));
                $this->position += strlen($text);

                return true;
            }
        }

        return false;
    }

    /**
     * @return array<string, TokenType>
     */
    private function operators(bool $extended): array
    {
        $operators = ['&&' => TokenType::AndIf, '||' => TokenType::OrIf];
        if ($extended) {
            $operators += ['|&' => TokenType::PipeBoth, '&>>' => TokenType::Redirect, '&>' => TokenType::Redirect];
        }

        return $operators + [
            ';' => TokenType::Semicolon,
            '&' => TokenType::Background,
            '|' => TokenType::Pipe,
            '!' => TokenType::Bang,
            '(' => TokenType::OpenParen,
            ')' => TokenType::CloseParen,
        ];
    }

    private function readRedirect(int $start, int $digits): bool
    {
        $this->position = $start + $digits;
        $descriptor = $digits > 0 ? (int) substr($this->source, $start, $digits) : null;
        $extended = $this->dialect !== ShellDialect::Sh;

        $forms = [
            '<<<' => $extended ? RedirectType::HereString : null,
            '<<-' => RedirectType::HereDocument,
            '<<' => RedirectType::HereDocument,
            '<>' => RedirectType::ReadWrite,
            '<&' => RedirectType::DuplicateInput,
            '<' => RedirectType::Input,
            '>>' => RedirectType::Append,
            '>|' => RedirectType::Clobber,
            '>&' => RedirectType::DuplicateOutput,
            '>' => RedirectType::Output,
        ];
        foreach ($forms as $text => $type) {
            if ($type === null || substr_compare($this->source, $text, $this->position, strlen($text)) !== 0) {
                continue;
            }
            $this->position += strlen($text);
            if ($type->isDuplicate() && $this->at($this->position) === '-') {
                $this->position++;
                $type = RedirectType::Close;
            }
            $this->emitRedirect($type, $descriptor ?? ($text[0] === '<' ? 0 : 1), $start);
            if ($type === RedirectType::HereDocument) {
                $this->hereDocuments->expectDelimiter($text === '<<-');
            }

            return true;
        }

        return false;
    }

    /**
     * Whether a command could start here: at the start of the line or after an operator that ends or joins commands.
     */
    private function atCommandStart(): bool
    {
        $last = $this->tokens[array_key_last($this->tokens) ?? -1] ?? null;

        return $last === null || in_array(
            $last->type,
            [
                TokenType::Newline,
                TokenType::Semicolon,
                TokenType::Background,
                TokenType::AndIf,
                TokenType::OrIf,
                TokenType::Pipe,
                TokenType::PipeBoth,
                TokenType::Bang,
                TokenType::OpenParen,
                TokenType::OpenBrace,
            ],
            true,
        );
    }

    /**
     * Reads (( ... )) up to its closing parentheses as one literal word, so nothing inside, such as <<, is lexed as
     * shell syntax; the grammar names it an unsupported arithmetic command.
     *
     * @throws ShellLineUnreadable
     */
    private function readArithmeticCommand(int $start): void
    {
        $depth = 0;
        $length = strlen($this->source);
        for ($index = $start; $index < $length; $index++) {
            $this->checkBudget();
            $character = $this->source[$index];
            if ($character === '(') {
                $depth++;
            } elseif ($character === ')' && --$depth === 0) {
                $this->position = $index + 1;
                $range = new SourceRange($start, $this->position);
                $text = substr($this->source, $start, $this->position - $start);
                $this->tokens[] = new Token(
                    TokenType::Word,
                    $range,
                    word: new Word([new WordSegment(WordSegmentType::Literal, $text, $range)], $range),
                );

                return;
            }
        }

        throw ShellLineUnreadable::unfinished('an arithmetic command', $start);
    }

    private function emitRedirect(RedirectType $type, int $descriptor, int $start): void
    {
        $this->tokens[] = new Token(
            TokenType::Redirect,
            new SourceRange($start, $this->position),
            redirect: $type,
            descriptor: $descriptor,
        );
    }

    private function readWordToken(): void
    {
        $start = $this->position;
        if (substr($this->source, $start, 3) === '[[ '
            && $this->dialect !== ShellDialect::Sh
            && $this->atCommandStart()) {
            $this->readConditionalExpression($start);

            return;
        }
        $word = $this->readWord();

        $this->hereDocuments->takeDelimiter(count($this->tokens) - 1);

        $literal = $word->literal();
        $isPlain = count($word->segments) === 1 && $word->segments[0]->type === WordSegmentType::Literal;
        $type = match (true) {
            $isPlain && $literal === '{' => TokenType::OpenBrace,
            $isPlain && $literal === '}' => TokenType::CloseBrace,
            default => TokenType::Word,
        };
        $this->tokens[] = new Token($type, new SourceRange($start, $this->position), word: $word);
    }

    /**
     * Reads one word up to an unquoted separator, as its segments in order.
     *
     * @throws ShellLineUnreadable
     */
    private function readWord(): Word
    {
        $start = $this->position;
        $word = new WordBuilder();
        $length = strlen($this->source);
        $extended = $this->dialect !== ShellDialect::Sh;

        while ($this->position < $length) {
            $this->checkBudget();
            $character = $this->source[$this->position];

            if ($extended
                && ($character === '<' || $character === '>')
                && $this->at($this->position + 1) === '('
                && $this->position === $start) {
                $word->add(
                    $this->position,
                    $this->readBalanced($this->position, $this->position + 2, 'a process substitution'),
                );

                continue;
            }
            if (str_contains(self::WORD_ENDS, $character)) {
                break;
            }
            match (true) {
                $character === '\\' => $this->readEscape($word),
                $character === "'" => $word->add($this->position, $this->readSingleQuoted()),
                $character === '"' => $word->add($this->position, ...$this->readDoubleQuoted()),
                $character === '$' || $character === '`' => $this->readExpansionOrDollar($word, $character),
                default => $word->addCharacter($character, $this->position++),
            };
        }

        return $word->word(new SourceRange($start, $this->position));
    }

    /**
     * Reads a backslash and the character it escapes, or skips a backslash-newline, which only continues the line.
     */
    private function readEscape(WordBuilder $word): void
    {
        if ($this->at($this->position + 1) === "\n") {
            $this->position += 2;

            return;
        }
        $escapeStart = $this->position;
        $this->position += min(2, strlen($this->source) - $this->position);
        $word->add(
            $escapeStart,
            new WordSegment(
                WordSegmentType::Escaped,
                substr($this->source, $escapeStart + 1, $this->position - $escapeStart - 1),
                new SourceRange($escapeStart, $this->position),
            ),
        );
    }

    /**
     * @throws ShellLineUnreadable
     */
    private function readSingleQuoted(): WordSegment
    {
        $close = strpos($this->source, "'", $this->position + 1);
        if ($close === false) {
            throw ShellLineUnreadable::unfinished('a single-quoted string', $this->position);
        }
        $segment = new WordSegment(
            WordSegmentType::SingleQuoted,
            substr($this->source, $this->position + 1, $close - $this->position - 1),
            new SourceRange($this->position, $close + 1),
        );
        $this->position = $close + 1;

        return $segment;
    }

    /**
     * Reads the expansion a $ or backtick starts; a $ that starts none is a plain character of the word.
     *
     * @throws ShellLineUnreadable
     */
    private function readExpansionOrDollar(WordBuilder $word, string $character): void
    {
        $expansionStart = $this->position;
        $expansion = $this->readExpansion();
        if ($expansion === null) {
            $word->addCharacter($character, $this->position++);

            return;
        }
        $word->add($expansionStart, $expansion);
    }

    /**
     * Reads [[ ... ]] up to its closing ]] as one literal word: inside it, && || < > and parentheses belong to the
     * test,
     * not to the shell.
     *
     * @throws ShellLineUnreadable
     */
    private function readConditionalExpression(int $start): void
    {
        $index = $start + 3;
        $length = strlen($this->source);
        while ($index < $length) {
            $this->checkBudget();
            $character = $this->source[$index];
            if ($character === '\\') {
                $index += 2;

                continue;
            }
            if ($character === "'") {
                $close = strpos($this->source, "'", $index + 1);
                if ($close === false) {
                    throw ShellLineUnreadable::unfinished('a single-quoted string', $index);
                }
                $index = $close + 1;

                continue;
            }
            if ($character === '"' || $character === '`') {
                $index = $this->closingQuote($character, $index + 1, $index, 'a quoted string') + 1;

                continue;
            }
            $closes = $character === ']' && $this->at($index + 1) === ']' && in_array(
                $this->source[$index - 1],
                [' ', "\t"],
                true,
            )
                && in_array($this->at($index + 2), ['', ' ', "\t", "\n", ';', '&', '|', ')'], true);
            if ($closes) {
                $this->position = $index + 2;
                $range = new SourceRange($start, $this->position);
                $text = substr($this->source, $start, $this->position - $start);
                $this->tokens[] = new Token(
                    TokenType::Word,
                    $range,
                    word: new Word([new WordSegment(WordSegmentType::Literal, $text, $range)], $range),
                );

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
    private function readDoubleQuoted(): array
    {
        $open = $this->position;
        $this->position++;
        $segments = [];
        $text = '';
        $textStart = $this->position;
        $length = strlen($this->source);

        while (true) {
            $this->checkBudget();
            if ($this->position >= $length) {
                throw ShellLineUnreadable::unfinished('a double-quoted string', $open);
            }
            $character = $this->source[$this->position];
            if ($character === '"') {
                break;
            }
            if ($character === '\\' && in_array($this->at($this->position + 1), ['$', '`', '"', '\\', "\n"], true)) {
                if ($this->at($this->position + 1) !== "\n") {
                    $text .= $this->source[$this->position + 1];
                }
                $this->position += 2;

                continue;
            }
            $startsExpansion = ($character === '$' && $this->at($this->position + 1) !== "'") || $character === '`';
            $expansion = $startsExpansion ? $this->readExpansion() : null;
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
                $textStart = $this->position;

                continue;
            }
            $text .= $character;
            $this->position++;
        }

        if ($text !== '' || $segments === []) {
            $segments[] = new WordSegment(
                WordSegmentType::DoubleQuoted,
                $text,
                new SourceRange($segments === [] ? $open : $textStart, $this->position + 1),
            );
        }
        $this->position++;

        return $segments;
    }

    /**
     * Reads $(...), $((...)), `...`, ${...} or $NAME at the position as one expansion; a lone $ answers null.
     *
     * @throws ShellLineUnreadable
     */
    private function readExpansion(): WordSegment|null
    {
        $start = $this->position;
        if ($this->source[$start] === '`') {
            $close = $start + 1;
            while (true) {
                $close = strpos($this->source, '`', $close);
                if ($close === false) {
                    throw ShellLineUnreadable::unfinished('a backtick substitution', $start);
                }
                if ($this->source[$close - 1] !== '\\') {
                    break;
                }
                $close++;
            }
            $this->position = $close + 1;

            return new WordSegment(
                WordSegmentType::Expansion,
                substr($this->source, $start + 1, $close - $start - 1),
                new SourceRange($start, $this->position),
            );
        }

        $next = $this->at($start + 1);
        if ($next === "'" && $this->dialect !== ShellDialect::Sh) {
            $close = $this->closingQuote("'", $start + 2, $start, 'an ANSI-C quoted string');
            $this->position = $close + 1;

            return new WordSegment(
                WordSegmentType::SingleQuoted,
                stripcslashes(substr($this->source, $start + 2, $close - $start - 2)),
                new SourceRange($start, $this->position),
            );
        }
        if ($next === '(') {
            return $this->readBalanced($start, $start + 2, 'a command substitution');
        }
        if ($next === '{') {
            $nameStart = $this->at($start + 2);
            $zshFlags = $this->dialect === ShellDialect::Zsh && $nameStart === '(';
            if ($nameStart === '' || ! ($zshFlags || ctype_alnum($nameStart) || str_contains('_@*#?$!-', $nameStart))) {
                throw ShellLineUnreadable::badSubstitution($start);
            }
            $this->position = $this->closingBrace($start) + 1;

            return new WordSegment(
                WordSegmentType::Expansion,
                substr($this->source, $start, $this->position - $start),
                new SourceRange($start, $this->position),
            );
        }
        $nameLength = strspn(
            $this->source,
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_',
            $start + 1,
        );
        if ($nameLength === 0 && $next !== '' && str_contains('@*#?$!-0123456789', $next)) {
            $nameLength = 1;
        }
        if ($nameLength === 0) {
            return null;
        }
        $this->position = $start + 1 + $nameLength;

        return new WordSegment(
            WordSegmentType::Expansion,
            substr($this->source, $start, $this->position - $start),
            new SourceRange($start, $this->position),
        );
    }

    /**
     * Reads up to the parenthesis that closes the one before $contentStart, past quotes and nested parentheses; the
     * segment's text is the source inside, which the parser reads as its own line.
     *
     * @throws ShellLineUnreadable
     */
    private function readBalanced(int $start, int $contentStart, string $what): WordSegment
    {
        $depth = 1;
        $index = $contentStart;
        $length = strlen($this->source);
        while ($index < $length) {
            $this->checkBudget();
            $character = $this->source[$index];
            if ($character === '\\') {
                $index += 2;

                continue;
            }
            if ($character === '$' && $this->at($index + 1) === "'") {
                $index = $this->closingQuote("'", $index + 2, $start, $what) + 1;

                continue;
            }
            if ($character === "'") {
                $close = strpos($this->source, "'", $index + 1);
                if ($close === false) {
                    throw ShellLineUnreadable::unfinished($what, $start);
                }
                $index = $close + 1;

                continue;
            }
            if ($character === '"' || $character === '`') {
                $index = $this->closingQuote($character, $index + 1, $start, $what) + 1;

                continue;
            }
            if ($character === '<' && $this->at($index + 1) === '<' && $this->at($index + 2) === '<') {
                $index += 3;

                continue;
            }
            if ($character === '<' && $this->at($index + 1) === '<') {
                $index = $this->pastNestedHereDocument($index, $start, $what);

                continue;
            }
            if ($character === 'c' && $this->startsWord($index, 'case')) {
                $index = $this->pastNestedCase($index, $start, $what);

                continue;
            }
            if ($character === '(') {
                $depth++;
            } elseif ($character === ')' && --$depth === 0) {
                $this->position = $index + 1;

                return new WordSegment(
                    WordSegmentType::Expansion,
                    substr($this->source, $contentStart, $index - $contentStart),
                    new SourceRange($start, $this->position),
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
    private function closingBrace(int $start): int
    {
        $depth = 1;
        $index = $start + 2;
        $length = strlen($this->source);
        while ($index < $length) {
            $character = $this->source[$index];
            if ($character === '\\') {
                $index += 2;

                continue;
            }
            if ($character === "'" || $character === '"' || $character === '`') {
                $index = $this->closingQuote($character, $index + 1, $start, 'a parameter expansion') + 1;

                continue;
            }
            if ($character === '$' && $this->at($index + 1) === '(') {
                $index = $this->endOfBalanced($index);

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
    private function endOfBalanced(int $index): int
    {
        $inner = new self($this->source, $this->dialect, $this->budget);
        $inner->readBalanced($index, $index + 2, 'a command substitution');

        return $inner->position;
    }

    /**
     * The position of the quote that closes the single or double quote at the index.
     *
     * @throws ShellLineUnreadable
     */
    private function closingQuoteOf(string $quote, int $index, int $start, string $what): int
    {
        if ($quote === '"') {
            return $this->closingQuote('"', $index + 1, $start, $what);
        }
        $close = strpos($this->source, "'", $index + 1);
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
    private function closingQuote(string $quote, int $index, int $start, string $what): int
    {
        $position = $index;
        $length = strlen($this->source);
        while ($position < $length) {
            if ($this->source[$position] === '\\') {
                $position += 2;

                continue;
            }
            if ($this->source[$position] === $quote) {
                return $position;
            }
            $position++;
        }

        throw ShellLineUnreadable::unfinished($what, $start);
    }

    /**
     * Whether the word at the index is exactly this keyword, standing on its own.
     */
    private function startsWord(int $index, string $keyword): bool
    {
        $before = $index === 0 ? ' ' : $this->source[$index - 1];
        $after = $this->at($index + strlen($keyword));

        return substr_compare($this->source, $keyword, $index, strlen($keyword)) === 0
            && str_contains(" \t\n;&|(", $before) && ($after === '' || str_contains(" \t\n;", $after));
    }

    /**
     * Inside a substitution, skips a case statement up to its esac, so the closing parenthesis of each pattern does
     * not close the substitution.
     *
     * @throws ShellLineUnreadable
     */
    private function pastNestedCase(int $index, int $start, string $what): int
    {
        $position = $index;
        $depth = 0;
        $length = strlen($this->source);
        while ($position < $length) {
            $character = $this->source[$position];
            if ($character === "'" || $character === '"') {
                $position = $this->closingQuoteOf($character, $position, $start, $what) + 1;

                continue;
            }
            if ($this->startsWord($position, 'case')) {
                $depth++;
                $position += 4;

                continue;
            }
            if ($this->startsWord($position, 'esac')

                    || ($this->startsWord($position, 'esa') === false && substr_compare($this->source, 'esac', $position, 4) === 0 && in_array($this->at($position + 4), ['', ')', ' ', ';', "\n"], true) && str_contains(" \t\n;", $this->source[$position - 1] ?? ' '))) {
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
    private function pastNestedHereDocument(int $index, int $start, string $what): int
    {
        $cursor = $index + 2;
        $stripsTabs = $this->at($cursor) === '-';
        $cursor += $stripsTabs ? 1 : 0;
        $cursor += strspn($this->source, " \t", $cursor);
        $delimiterLength = strcspn($this->source, " \t\n;&|<>()", $cursor);
        $delimiter = str_replace(["'", '"', '\\'], '', substr($this->source, $cursor, $delimiterLength));
        if ($delimiter === '') {
            return $index + 2;
        }
        $lineEnd = strpos($this->source, "\n", $cursor);
        if ($lineEnd === false) {
            return $cursor + $delimiterLength;
        }
        $lineStart = $lineEnd + 1;
        $length = strlen($this->source);
        while ($lineStart <= $length) {
            $next = strpos($this->source, "\n", $lineStart);
            $next = $next === false ? $length : $next;
            $line = substr($this->source, $lineStart, $next - $lineStart);
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

    /**
     * Reads the bodies of the here-documents named on the line just ended, in order, each up to its delimiter line.
     *
     * @throws ShellLineUnreadable
     */
    private function readHereDocumentBodies(): void
    {
        foreach ($this->hereDocuments->takeWaiting() as $waiting) {
            $redirectIndex = $waiting->redirect;
            $stripsTabs = $waiting->stripsTabs;
            $delimiterWord = $this->tokens[$redirectIndex + 1]->word ?? throw ShellLineUnreadable::unfinished(
                'a here-document without a delimiter',
                $this->tokens[$redirectIndex]->range->start,
            );
            $isQuoted = array_any(
                $delimiterWord->segments,
                fn (WordSegment $segment) => $segment->type !== WordSegmentType::Literal,
            );
            $delimiter = implode('', array_map(fn (WordSegment $segment) => $segment->text, $delimiterWord->segments));

            $bodyStart = $this->position;
            $lineStart = $this->position;
            $found = false;
            $bodyEnd = $lineStart;
            $length = strlen($this->source);
            while ($lineStart <= $length) {
                $this->checkBudget();
                $lineEnd = strpos($this->source, "\n", $lineStart);
                $lineEnd = $lineEnd === false ? $length : $lineEnd;
                $line = substr($this->source, $lineStart, $lineEnd - $lineStart);
                if (($stripsTabs ? ltrim($line, "\t") : $line) === $delimiter) {
                    $found = true;
                    $bodyEnd = $lineStart;
                    $this->position = min($lineEnd + 1, $length);

                    break;
                }
                if ($lineEnd === $length) {
                    break;
                }
                $lineStart = $lineEnd + 1;
            }
            if (! $found) {
                throw ShellLineUnreadable::unfinished(
                    "the here-document ended by {$delimiter}",
                    $this->tokens[$redirectIndex]->range->start,
                );
            }

            $body = new SourceRange($bodyStart, $bodyEnd);
            $this->tokens[] = new Token(
                TokenType::HereDocumentBody,
                $body,
                word: $isQuoted ? null : new self($this->source, $this->dialect, $this->budget)->substitutionsIn($body),
                hereDocument: new HereDocument($delimiter, $isQuoted, $stripsTabs, $body),
            );
        }
    }

    /**
     * The $(...) and backtick substitutions in an unquoted here-document body; its ordinary lines are only text. It
     * runs
     * on a scan of its own, so the scan that found the body keeps its place.
     */
    private function substitutionsIn(SourceRange $body): Word
    {
        $segments = [];
        $this->position = $body->start;
        while ($this->position < $body->end) {
            $character = $this->source[$this->position];
            if ($character === '\\') {
                $this->position += 2;

                continue;
            }
            $expansion = ($character === '`' || ($character === '$' && $this->at(
                $this->position + 1,
            ) === '(')) ? $this->readExpansion() : null;
            if ($expansion !== null) {
                $segments[] = $expansion;

                continue;
            }
            $this->position++;
        }

        return new Word($segments, $body);
    }

    private function emit(TokenType $type, int $start, int $end): void
    {
        $this->tokens[] = new Token($type, new SourceRange($start, $end));
    }

    private function at(int $index): string
    {
        return $this->source[$index] ?? '';
    }

    /**
     * @throws ShellLineUnreadable
     */
    private function checkBudget(): void
    {
        if (++$this->steps % 256 === 0 && $this->budget->isSpent()) {
            throw ShellLineUnreadable::pastLimit(AnalysisLimit::Milliseconds, $this->position);
        }
    }
}
