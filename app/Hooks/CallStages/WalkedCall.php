<?php

declare(strict_types=1);

namespace App\Hooks\CallStages;

use App\Models\Agents\AgentStackRow;
use App\Stacks\AgentStack;
use App\Stacks\HookAnswer;

/**
 * A hook call with its final answer and the stack it found.
 */
final readonly class WalkedCall
{
    public function __construct(
        public HookCallStage $call,
        public AgentStackRow $row,
        public AgentStack $stackBefore,
        public HookAnswer $answer,
    ) {}

    /**
     * Whether the answer carries messages for an agent it leaves idle: they are kept for its next turn, and it is woken.
     */
    public function leavesMessagesWithIdleAgent(): bool
    {
        return $this->answer->messages !== [] && $this->call->input->leavesAgentIdle(
            $this->answer->decision->answerType(),
        );
    }

    public function answeredBy(HookAnswer $answer): self
    {
        return clone ($this, ['answer' => $answer]);
    }

    public function settled(): SettledCall
    {
        return new SettledCall($this->call, $this->row, $this->answer);
    }
}
