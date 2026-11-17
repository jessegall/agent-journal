<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

use App\Core\Hooks\Contracts\Answer;
use App\Core\Hooks\Contracts\Refusal;
use App\Core\Hooks\Contracts\StackTransition;
use App\Core\Hooks\Exceptions\ConflictingStackTransition;
use App\Core\Hooks\Exceptions\NoRefusalReason;
use App\Core\Hooks\Exceptions\NoReplacementLine;

/**
 * A state's answer to one hook: the answer, one transition of the stack, and any context for the agent.
 */
final readonly class Decision
{
    /**
     * @param  list<string>  $context
     */
    private function __construct(
        public Answer $answer,
        public StackTransition $transition,
        public array $context = [],
    ) {}

    /**
     * A decision that answers and leaves the stack as it is; the stack changes only through push() and pop().
     */
    private static function answering(Answer $answer): self
    {
        return new self($answer, SimpleTransition::Keep);
    }

    public static function delegate(): self
    {
        return self::answering(SimpleAnswer::Delegate);
    }

    public static function allow(): self
    {
        return self::answering(SimpleAnswer::Allow);
    }

    public static function deny(string $reason): self
    {
        return self::answering(new Denied(new Reason($reason)));
    }

    public static function preventStop(string $reason): self
    {
        return self::answering(new StopPrevented(new Reason($reason)));
    }

    public static function rewrite(string $line): self
    {
        return self::answering(new Rewritten($line));
    }

    public static function addContext(string $text): self
    {
        return self::delegate()->withContext($text);
    }

    public static function push(StateReference $state): self
    {
        return self::delegate()->withPush($state);
    }

    public static function pop(): self
    {
        return new self(SimpleAnswer::Delegate, SimpleTransition::PopSelf);
    }

    public function withContext(string $text): self
    {
        return new self($this->answer, $this->transition, [...$this->context, $text]);
    }

    public function withPush(StateReference $state): self
    {
        if ($this->transition !== SimpleTransition::Keep) {
            throw ConflictingStackTransition::forTransition($this->transition->kind()->value);
        }

        return new self($this->answer, new PushState($state), $this->context);
    }

    public function isDelegating(): bool
    {
        return $this->answer === SimpleAnswer::Delegate;
    }

    /**
     * The shell line a rewrite runs instead of the one the agent wrote.
     */
    public function replacementLine(): string
    {
        if (! $this->answer instanceof Rewritten) {
            throw NoReplacementLine::forAnswer($this->answerKind()->value);
        }

        return $this->answer->line;
    }

    /**
     * The reason a denial or a held stop gives the agent.
     */
    public function refusalReason(): string
    {
        if (! $this->answer instanceof Refusal) {
            throw NoRefusalReason::forAnswer($this->answerKind()->value);
        }

        return $this->answer->reason()->text;
    }

    public function answerKind(): AnswerKind
    {
        return $this->answer->kind();
    }
}
