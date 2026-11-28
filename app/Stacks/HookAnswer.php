<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Actors\Contracts\AgentTexts;
use App\Bus\Contracts\Command;
use App\Contracts\Events\Event;
use App\Hooks\Contracts\HookDecider;
use App\Hooks\Enums\AnswerType;
use App\Support\Decisions\Decision;
use App\Support\Storage\WalkStep;
use App\Values\AgentText;
use PhpOption\Option;

/**
 * What one walk ends with: the answering decision, the context every visited state added, the messages among it, the
 * commands and events the states answered with, in order, and the steps taken, with the stack as the walk left it.
 */
final readonly class HookAnswer
{
    /**
     * The decision the walk itself gave, kept when a decider replaces it, such as the shell admission's runner line.
     */
    public Decision $walkedDecision;

    /**
     * @param  list<string>  $context
     * @param  list<WalkStep>  $steps
     * @param  list<string>  $messages
     * @param  list<Command<mixed>|Event>  $effects
     */
    public function __construct(
        public Decision $decision,
        public array $context,
        public array $steps,
        public AgentStack $stack,
        public array $messages = [],
        public array $effects = [],
    ) {
        $this->walkedDecision = $decision;
    }

    /**
     * The same walk answered by another decision on another stack, such as a refused rewrite on the stack from before
     * it; only a decider replaces an answer.
     */
    public function replacedBy(HookDecider $decider, Decision $decision, AgentStack $stack): self
    {
        return $this->decidedAs($decision, $stack);
    }

    /**
     * The decision shown for the tool call. Admitted calls display the line the agent or a state supplied.
     */
    public function shownDecision(): Decision
    {
        if ($this->isDenied()) {
            return $this->decision;
        }

        return $this->walkedDecision;
    }

    /**
     * The same answer with reminders read before the walk put first in its context.
     *
     * @param  list<string>  $reminders
     */
    public function withRemindersFirst(array $reminders): self
    {
        return clone ($this, ['context' => [...$reminders, ...$this->context]]);
    }

    /**
     * The same answer with one more line at the end of its context.
     */
    public function withContextAdded(string $line): self
    {
        return clone ($this, ['context' => [...$this->context, $line]]);
    }

    /**
     * The lines shown beside the decision: each once, and none that repeats the refusal reason shown with them.
     *
     * @return list<string>
     */
    public function shownContext(AgentTexts $texts): array
    {
        $reason = $this->isDenied() ? [$texts->render($this->decision->refusalReason())] : [];

        return array_values(array_diff(array_unique($this->context), $reason));
    }

    /**
     * The instruction the stack this walk left shows.
     *
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return $this->stack->instruction();
    }

    public function isRewrite(): bool
    {
        return $this->decision->answerType() === AnswerType::Rewrite;
    }

    public function isDenied(): bool
    {
        return $this->decision->answerType() === AnswerType::Deny;
    }

    public function isAllowed(): bool
    {
        return $this->decision->answerType() === AnswerType::Allow;
    }

    /**
     * This rewrite, accepted after its replacement was walked: the replacement's stack and the context and steps of
     * both walks.
     */
    public function acceptedWith(self $replacement): self
    {
        return $this->withFollowingWalk($replacement)->decidedAs($this->decision, $replacement->stack);
    }

    /**
     * The refusal of a replacement, with the stack as it was before the rewrite was proposed.
     */
    public function refusedOn(AgentStack $stackBefore, self $rewrite): self
    {
        return $rewrite->withFollowingWalk($this)->decidedAs($this->decision, $stackBefore);
    }

    private function decidedAs(Decision $decision, AgentStack $stack): self
    {
        return clone ($this, ['decision' => $decision, 'stack' => $stack]);
    }

    private function withFollowingWalk(self $following): self
    {
        return clone ($this, [
            'context' => [...$this->context, ...$following->context],
            'steps' => [...$this->steps, ...$following->steps],
            'messages' => [...$this->messages, ...$following->messages],
            'effects' => [...$this->effects, ...$following->effects],
        ]);
    }
}
