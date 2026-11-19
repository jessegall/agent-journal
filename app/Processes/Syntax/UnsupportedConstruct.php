<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\UnsupportedKeyword;

/**
 * Follows the tokens of a construct the grammar does not support, such as if or a loop, to find where it ends: at the
 * reserved word that closes it, past nested constructs of the same family, or, for a construct with no closing word,
 * at the first separator outside its parentheses.
 */
final class UnsupportedConstruct
{
    /**
     * Words after which the next word stands where a command starts.
     */
    private const array COMMAND_STARTING_WORDS = ['do', 'then', 'else', 'elif', 'time', 'fi', 'done', 'esac'];

    private int $nesting = 0;

    private int $parentheses = 0;

    private bool $atCommandStart = false;

    private bool $closed = false;

    /**
     * @var list<string> the words that open a construct this terminator also closes, so nesting is counted
     */
    private readonly array $openers;

    public function __construct(private readonly string|null $terminator)
    {
        $this->openers = UnsupportedKeyword::closedBy($terminator);
    }

    /**
     * Whether the construct has no closing word and this token, outside its parentheses, ends it before the token.
     */
    public function endsBefore(Token $token): bool
    {
        return $this->terminator === null && $this->parentheses === 0 && $token->type->isCommandSeparator();
    }

    /**
     * Takes in one token of the construct, with its text when it is a plain word.
     */
    public function read(Token $token): void
    {
        $literal = $token->literal();
        $wasAtCommandStart = $this->atCommandStart;
        $this->atCommandStart = $token->type->isFollowedByCommand() || in_array(
            $literal,
            self::COMMAND_STARTING_WORDS,
            true,
        );
        if ($token->type->isGroupOpener()) {
            $this->parentheses++;

            return;
        }
        if ($token->type->isGroupCloser() && $this->parentheses > 0) {
            $this->parentheses--;

            return;
        }
        if ($this->terminator !== null && $wasAtCommandStart && $literal !== null) {
            $this->readReservedWord($literal);
        }
    }

    public function isClosed(): bool
    {
        return $this->closed;
    }

    public function needsClosing(): bool
    {
        return $this->terminator !== null && ! $this->closed;
    }

    private function readReservedWord(string $literal): void
    {
        if (in_array($literal, $this->openers, true)) {
            $this->nesting++;

            return;
        }
        if ($literal !== $this->terminator) {
            return;
        }
        if ($this->nesting === 0) {
            $this->closed = true;

            return;
        }
        $this->nesting--;
    }
}
