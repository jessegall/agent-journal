<?php

declare(strict_types=1);

namespace App\Hooks\Decisions;

use App\Hooks\Contracts\Answer;
use App\Hooks\Contracts\Refusal;
use App\Hooks\Contracts\StackTransition;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\SimpleAnswer;
use App\Hooks\Enums\SimpleTransition;
use App\Hooks\Exceptions\ConflictingStackTransition;
use App\Hooks\Exceptions\NoRefusalReason;
use App\Hooks\Exceptions\NoReplacementLine;

/**
 * A state's answer to one hook: the answer, one transition of the stack, any context for the agent, and the messages
 * among that context that wake the agent when the hook leaves it idle.
 */
final readonly class Decision
{
    /**
     * @param  list<string>  $context
     * @param  list<string>  $messages
     */
    private function __construct(
        public Answer $answer,
        public StackTransition $transition,
        public array $context = [],
        public array $messages = [],
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

    public static function rewrite(string $line): self
    {
        return self::answering(new Rewritten($line));
    }

    public static function addContext(string $text): self
    {
        return self::delegate()->withContext($text);
    }

    /**
     * The text added to the agent's context, and kept for its next hook with a wake when this hook leaves it idle.
     */
    public static function message(string $text): self
    {
        return self::delegate()->withMessage($text);
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
        return new self($this->answer, $this->transition, [...$this->context, $text], $this->messages);
    }

    public function withMessage(string $text): self
    {
        return new self($this->answer, $this->transition, [...$this->context, $text], [...$this->messages, $text]);
    }

    public function withPush(StateReference $state): self
    {
        if ($this->transition !== SimpleTransition::Keep) {
            throw ConflictingStackTransition::forTransition($this->transition->type()->value);
        }

        return new self($this->answer, new PushState($state), $this->context, $this->messages);
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
            throw NoReplacementLine::forAnswer($this->answerType()->value);
        }

        return $this->answer->line;
    }

    /**
     * The reason a denial or a held stop gives the agent.
     */
    public function refusalReason(): string
    {
        if (! $this->answer instanceof Refusal) {
            throw NoRefusalReason::forAnswer($this->answerType()->value);
        }

        return $this->answer->reason()->text;
    }

    public function answerType(): AnswerType
    {
        return $this->answer->type();
    }
}
