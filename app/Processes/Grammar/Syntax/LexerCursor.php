<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax;

use App\CommandRules\Enums\AnalysisLimit;
use App\CommandRules\Enums\RedirectType;
use App\CommandRules\Enums\TokenType;
use App\CommandRules\Enums\WordSegmentType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Grammar\Exceptions\ShellLineUnreadable;
use App\Processes\Grammar\Values\SourceRange;
use App\Processes\Grammar\Values\WordSegment;
use App\Values\Word;

/**
 * The source position, emitted tokens and pending here-documents of one scan.
 */
final class LexerCursor
{
    private const array OPERATORS = [
        '&' => [
            '&&' => TokenType::AndIf,
            '&' => TokenType::Background,
        ],
        '|' => [
            '||' => TokenType::OrIf,
            '|' => TokenType::Pipe,
        ],
        ';' => [';' => TokenType::Semicolon],
        '!' => ['!' => TokenType::Bang],
        '(' => ['(' => TokenType::OpenParen],
        ')' => [')' => TokenType::CloseParen],
    ];

    private const array EXTENDED_OPERATORS = [
        '&' => [
            '&>>' => TokenType::Redirect,
            '&>' => TokenType::Redirect,
        ],
        '|' => ['|&' => TokenType::PipeBoth],
    ];

    public int $position = 0;

    public readonly HereDocumentQueue $hereDocuments;

    /**
     * @var list<Token>
     */
    private array $tokens = [];

    private int $steps = 0;

    public function __construct(
        public readonly string $source,
        public readonly ShellDialect $dialect,
        private readonly TimeBudget $budget,
    ) {
        $this->hereDocuments = new HereDocumentQueue();
    }

    public function fork(): self
    {
        return new self($this->source, $this->dialect, $this->budget);
    }

    public function hasBytes(): bool
    {
        return $this->position < strlen($this->source);
    }

    public function current(): string
    {
        return $this->at($this->position);
    }

    public function append(Token $token): void
    {
        $this->tokens[] = $token;
    }

    /**
     * @return list<Token>
     */
    public function tokens(): array
    {
        return $this->tokens;
    }

    /**
     * Whether a command could start here: at the start of the line or after an operator that ends or joins commands.
     */
    public function isAtCommandStart(): bool
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
     * The source from the start up to the end as one literal word, read on from the end.
     */
    public function emitLiteralWord(int $start, int $end): void
    {
        $this->position = $end;
        $range = new SourceRange($start, $end);
        $text = substr($this->source, $start, $end - $start);

        $this->tokens[] = new Token(
            TokenType::Word,
            $range,
            word: new Word([new WordSegment(WordSegmentType::Literal, $text, $range)], $range),
        );
    }

    public function emit(TokenType $type, int $start, int $end): void
    {
        $this->tokens[] = new Token($type, new SourceRange($start, $end));
    }

    public function at(int $index): string
    {
        return $this->source[$index] ?? '';
    }

    /**
     * @throws ShellLineUnreadable
     */
    public function assertWithinBudget(): void
    {
        if ($this->steps++ % 256 === 0 && $this->budget->isSpent()) {
            throw ShellLineUnreadable::pastLimit(AnalysisLimit::Milliseconds, $this->position);
        }
    }

    /**
     * Reads an operator or a redirect at the position; answers false when a word starts here instead.
     */
    public function readOperator(): bool
    {
        $start = $this->position;
        $first = $this->source[$start];
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

        if ($first === '(' && $this->at($start + 1) === '(' && $this->isAtCommandStart()) {
            $this->readArithmeticCommand($start);

            return true;
        }

        foreach ($this->operators($first, $extended) as $text => $type) {
            if (substr_compare($this->source, $text, $start, strlen($text)) !== 0) {
                continue;
            }

            if ($type === TokenType::Bang && ! $this->isNegation()) {
                return false;
            }

            $this->position += strlen($text);

            if ($type === TokenType::Redirect) {
                $redirect = $text === '&>>' ? RedirectType::Append : RedirectType::Output;
                $this->emitRedirect($redirect, 1, $start);

                return true;
            }

            $this->emit($type, $start, $this->position);

            return true;
        }

        return false;
    }

    private function isNegation(): bool
    {
        return $this->isAtCommandStart() && in_array($this->at($this->position + 1), [' ', "\t", "\n", ''], true);
    }

    /**
     * @return array<string, TokenType>
     */
    private function operators(string $first, bool $isExtended): array
    {
        $operators = self::OPERATORS[$first] ?? [];

        if ($isExtended && isset(self::EXTENDED_OPERATORS[$first])) {
            return self::EXTENDED_OPERATORS[$first] + $operators;
        }

        return $operators;
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
            $this->assertWithinBudget();
            $character = $this->source[$index];

            if ($character === '(') {
                $depth++;
            } elseif ($character === ')' && --$depth === 0) {
                $this->emitLiteralWord($start, $index + 1);

                return;
            }
        }

        throw ShellLineUnreadable::unfinished('an arithmetic command', $start);
    }

    private function emitRedirect(RedirectType $type, int $descriptor, int $start): void
    {
        $this->append(new Token(
            TokenType::Redirect,
            new SourceRange($start, $this->position),
            redirect: $type,
            descriptor: $descriptor,
        ));
    }
}
