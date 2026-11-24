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
 * What one state answered a hook: its decision, delegate unless it made one as its last part, the lines it added
 * and the commands and events it answered with.
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
        public Decision $decision,
        public array $lines = [],
        public array $effects = [],
    ) {}

    /**
     * The answer from what the state's method returned: one part, or several yielded with the decision last. A
     * delegate is the part that passes the hook on.
     *
     * @param  AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>  $returned
     *
     * @throws HookAnswerRefused
     */
    public static function of(AnswerPart|Command|Event|iterable $returned, string $state, string $hook): self
    {
        $parts = is_iterable($returned) ? $returned : [$returned];

        $answer = new self($state, $hook, Decision::delegate());

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
     * A delegate leaves the answer delegating, so the walk goes on to the state below.
     *
     * @throws HookAnswerRefused when the decision is an allow, which a state never answers
     */
    public function withDecision(Decision $decision): self
    {
        if ($decision->answerType() === AnswerType::Allow) {
            throw HookAnswerRefused::allowIsPassing($this->state, $this->hook);
        }

        if ($decision->answerType() === AnswerType::Delegate) {
            return $this;
        }

        return clone ($this, ['decision' => $decision]);
    }

    /**
     * @throws HookAnswerRefused
     */
    private function with(mixed $part): self
    {
        if ($this->decision->answerType() !== AnswerType::Delegate) {
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
