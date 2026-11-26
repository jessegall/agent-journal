<?php

declare(strict_types=1);

namespace App\Skills;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\Work\StackTransactionRunner;
use App\Events\Skills\SkillReadAsked;
use App\Stacks\Contracts\Work\AgentStacks;
use App\Stacks\Support\ReadSkillStateReference;
use App\Values\StackTarget;

/**
 * The one place that asks an agent to read skills whole: it puts the reading state on the agent's stack, which stays
 * as it is while one is active, and tells it which skills to take on. An empty list asks nothing.
 */
final readonly class SkillReadAsks
{
    public function __construct(
        private AgentStacks $stacks,
        private CommandFacts $facts,
        private StackTransactionRunner $transactions,
    ) {}

    /**
     * @param  list<string>  $skillKeys
     */
    public function ask(StackTarget $target, array $skillKeys): void
    {
        if ($skillKeys === []) {
            return;
        }

        $this->transactions->run(function () use ($target, $skillKeys): void {
            $this->stacks->push($target, ReadSkillStateReference::forSession($target->sessionId));
            $this->facts->publishAfterCommit(new SkillReadAsked($target->sessionId, $skillKeys));
        });
    }
}
