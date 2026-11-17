<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use App\Domain\Hooks\Decisions\AnswerKind;
use App\Domain\Hooks\Decisions\Decision;

/**
 * What one walk ends with: the answering decision, the context every visited state added, and the steps taken, with the stack as the walk left it.
 */
final readonly class HookAnswer
{
    /**
     * @param  list<string>  $context
     * @param  list<WalkStep>  $steps
     */
    public function __construct(
        public Decision $decision,
        public array $context,
        public array $steps,
        public AgentStack $stack,
    ) {}

    /**
     * The same walk answered by another decision on another stack, such as a refused rewrite on the stack from before it.
     */
    public function replacedBy(Decision $decision, AgentStack $stack): self
    {
        return new self($decision, $this->context, $this->steps, $stack);
    }

    public function isRewrite(): bool
    {
        return $this->decision->answerKind() === AnswerKind::Rewrite;
    }

    public function isAllowed(): bool
    {
        return $this->decision->answerKind() === AnswerKind::Allow;
    }

    /**
     * This rewrite, accepted after its replacement was walked: the replacement's stack and the context and steps of both walks.
     */
    public function acceptedWith(self $replacement): self
    {
        return new self(
            $this->decision,
            [...$this->context, ...$replacement->context],
            [...$this->steps, ...$replacement->steps],
            $replacement->stack,
        );
    }

    /**
     * The refusal of a replacement, with the stack as it was before the rewrite was proposed.
     */
    public function refusedOn(AgentStack $stackBefore, self $rewrite): self
    {
        return new self($this->decision, $this->context, [...$rewrite->steps, ...$this->steps], $stackBefore);
    }
}
