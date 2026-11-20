<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\TokenType;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Exceptions\ShellLineUnreadable;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;
use App\Processes\Values\WordSegment;

/**
 * The source position, emitted tokens and pending here-documents of one scan.
 */
final class LexerCursor
{
    public int $position = 0;

    /**
     * @var list<Token>
     */
    private array $tokens = [];

    public readonly HereDocumentQueue $hereDocuments;

    private int $steps = 0;

    private readonly int $length;

    public function __construct(
        public readonly string $source,
        public readonly ShellDialect $dialect,
        private readonly TimeBudget $budget,
    ) {
        $this->hereDocuments = new HereDocumentQueue();
        $this->length = strlen($source);
    }

    public function fork(): self
    {
        return new self($this->source, $this->dialect, $this->budget);
    }

    public function hasBytes(): bool
    {
        return $this->position < $this->length;
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
    public function atCommandStart(): bool
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
        if (++$this->steps % 256 === 0 && $this->budget->isSpent()) {
            throw ShellLineUnreadable::pastLimit(AnalysisLimit::Milliseconds, $this->position);
        }
    }
}
