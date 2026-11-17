<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

use App\Domain\Hooks\StateReference;

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
            throw ConflictingStackChange::forDecision($this);
        }

        return new self($this->answer, new PushState($state), $this->context);
    }

    public function isDelegating(): bool
    {
        return $this->answer === SimpleAnswer::Delegate;
    }

    public function answerLabel(): string
    {
        return $this->answer->label();
    }
}
