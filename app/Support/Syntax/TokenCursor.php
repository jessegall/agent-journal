<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\CommandRules\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\Syntax\Token;
use App\Values\AgentText;
use App\Values\Word;

/**
 * The grammar's place in one line's tokens. Here-document bodies are taken out of the stream and handed to the
 * here-document redirects in the order they were written; the offset is where this line starts in the whole source.
 */
final class TokenCursor
{
    /**
     * @var list<Token>
     */
    private array $tokens;

    /**
     * @var list<Token>
     */
    private array $hereDocumentBodies;

    private int $index = 0;

    /**
     * @param  list<Token>  $tokens
     */
    public function __construct(array $tokens, private readonly int $offset)
    {
        $this->tokens = array_values(
            array_filter($tokens, fn (Token $token) => $token->type !== TokenType::HereDocumentBody),
        );

        $this->hereDocumentBodies = array_values(
            array_filter($tokens, fn (Token $token) => $token->type === TokenType::HereDocumentBody),
        );
    }

    public function isAtEnd(): bool
    {
        return $this->index >= count($this->tokens);
    }

    public function current(): Token
    {
        return $this->tokens[$this->index];
    }

    /**
     * @phpstan-impure
     */
    public function is(TokenType $type): bool
    {
        return ! $this->isAtEnd() && $this->tokens[$this->index]->type === $type;
    }

    public function isNext(int $ahead, TokenType $type): bool
    {
        return ($this->tokens[$this->index + $ahead] ?? null)?->type === $type;
    }

    public function advance(): void
    {
        $this->index++;
    }

    public function skip(TokenType ...$types): void
    {
        while (! $this->isAtEnd() && in_array($this->current()->type, $types, true)) {
            $this->index++;
        }
    }

    /**
     * The byte in the whole source where the current token starts, or where the line ends.
     */
    public function position(): int
    {
        $token = $this->tokens[$this->index] ?? $this->tokens[array_key_last($this->tokens) ?? 0] ?? null;

        return $this->offset + (match (true) {
            $token === null => 0,
            $this->isAtEnd() => $token->range->end,
            default => $token->range->start,
        });
    }

    /**
     * The byte in the whole source where the current token ends.
     */
    public function currentEnd(): int
    {
        return $this->offset + $this->current()->range->end;
    }

    public function currentType(): TokenType
    {
        return $this->current()->type;
    }

    /**
     * The text of the current token when it is a word without expansions, or null.
     */
    public function currentLiteral(): string|null
    {
        return $this->current()->literal();
    }

    /**
     * The word the current token holds, in positions of the whole source.
     *
     * @throws ShellGrammarStopped
     */
    public function word(AgentText $missing): Word
    {
        $word = $this->current()->word;

        if ($word === null) {
            throw ShellGrammarStopped::invalid($missing, $this->position());
        }

        return $word->shiftedBy($this->offset);
    }

    public function offset(): int
    {
        return $this->offset;
    }

    public function takeHereDocumentBody(): Token|null
    {
        return array_shift($this->hereDocumentBodies);
    }
}
