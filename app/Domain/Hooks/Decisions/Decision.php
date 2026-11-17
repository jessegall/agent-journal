<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

/**
 * A state's answer to one hook: the answer, one change to the stack, and any context for the agent.
 */
final readonly class Decision
{
    /**
     * @param  list<string>  $context
     */
    private function __construct(
        public Answer $answer,
        public StackChange $change = SimpleChange::Keep,
        public array $context = [],
    ) {}

    public static function delegate(): self
    {
        return new self(SimpleAnswer::Delegate);
    }

    public static function allow(): self
    {
        return new self(SimpleAnswer::Allow);
    }

    public static function deny(string $reason): self
    {
        return new self(new Denied(new Reason($reason)));
    }

    public static function preventStop(string $reason): self
    {
        return new self(new StopPrevented(new Reason($reason)));
    }

    public static function rewrite(string $line): self
    {
        return new self(new Rewritten($line));
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
        return new self(SimpleAnswer::Delegate, SimpleChange::PopSelf);
    }

    public function withContext(string $text): self
    {
        return new self($this->answer, $this->change, [...$this->context, $text]);
    }

    public function withPush(StateReference $state): self
    {
        if ($this->change !== SimpleChange::Keep) {
            throw ConflictingStackChange::forChange($this->change->kind());
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
            throw NoReplacementLine::forAnswer($this->answerKind());
        }

        return $this->answer->line;
    }

    /**
     * The reason a denial or a held stop gives the agent.
     */
    public function refusalReason(): string
    {
        if (! $this->answer instanceof Refusal) {
            throw NoRefusalReason::forAnswer($this->answerKind());
        }

        return $this->answer->reason()->text;
    }

    public function answerKind(): AnswerKind
    {
        return $this->answer->kind();
    }
}
