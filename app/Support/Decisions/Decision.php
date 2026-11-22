<?php

declare(strict_types=1);

namespace App\Support\Decisions;

use App\Contracts\Answer;
use App\Enums\AnswerType;
use App\Exceptions\NoRefusalReason;
use App\Exceptions\NoReplacementLine;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Decisions\Enums\SimpleAnswer;
use App\Support\Stack\StateAnswer;

/**
 * A state's decision on one hook, a deny or a rewrite, or the allow its caller answers when no state decided.
 */
final readonly class Decision implements AnswerPart
{
    private function __construct(public Answer $answer) {}

    /**
     * What the walk answers when every state passed: only the caller answers it, never a state.
     */
    public static function allow(): self
    {
        return new self(SimpleAnswer::Allow);
    }

    public static function deny(string $reason): self
    {
        return new self(new Denied(new Reason($reason)));
    }

    public static function rewrite(string $line): self
    {
        return new self(new Rewritten($line));
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
        if (! $this->answer instanceof Denied) {
            throw NoRefusalReason::forAnswer($this->answerType()->value);
        }

        return $this->answer->reason()->text;
    }

    public function answerType(): AnswerType
    {
        return $this->answer->type();
    }

    public function addTo(StateAnswer $answer): StateAnswer
    {
        return $answer->withDecision($this);
    }
}
