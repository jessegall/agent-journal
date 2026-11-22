<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Enums\AnswerType;
use App\Exceptions\HookAnswerRefused;
use App\Support\Decisions\ContextLine;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Decisions\Decision;
use App\Support\Decisions\MessageLine;

/**
 * What one state answered a hook: the lines it added, the commands and events it answered with, and its decision, if
 * it made one, which is always the last part.
 */
final readonly class StateAnswer
{
    /**
     * @param  list<ContextLine|MessageLine>  $lines
     * @param  list<Command<mixed>|Event>  $effects
     */
    private function __construct(
        public string $state,
        public string $hook,
        public array $lines = [],
        public array $effects = [],
        public Decision|null $decision = null,
    ) {}

    /**
     * The answer from what the state's method returned: nothing to pass, one part, or several yielded with the decision
     * last.
     *
     * @throws HookAnswerRefused
     */
    public static function of(mixed $returned, string $state, string $hook): self
    {
        $parts = match (true) {
            $returned === null => [],
            is_iterable($returned) => $returned,
            default => [$returned],
        };

        $answer = new self($state, $hook);

        foreach ($parts as $part) {
            $answer = $answer->with($part);
        }

        return $answer;
    }

    public function withLine(ContextLine|MessageLine $line): self
    {
        return clone ($this, ['lines' => [...$this->lines, $line]]);
    }

    /**
     * @throws HookAnswerRefused when the decision is an allow, which a state never answers
     */
    public function withDecision(Decision $decision): self
    {
        if ($decision->answerType() === AnswerType::Allow) {
            throw HookAnswerRefused::allowIsPassing($this->state, $this->hook);
        }

        return clone ($this, ['decision' => $decision]);
    }

    /**
     * @throws HookAnswerRefused
     */
    private function with(mixed $part): self
    {
        if ($this->decision !== null) {
            throw HookAnswerRefused::afterDecision($this->state, $this->hook);
        }

        if ($part instanceof AnswerPart) {
            return $part->addTo($this);
        }

        if (! $part instanceof Command && ! $part instanceof Event) {
            throw HookAnswerRefused::notAnAnswer($this->state, $this->hook, get_debug_type($part));
        }

        return clone ($this, ['effects' => [...$this->effects, $part]]);
    }
}
