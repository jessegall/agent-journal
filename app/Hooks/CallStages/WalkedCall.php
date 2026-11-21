<?php

declare(strict_types=1);

namespace App\Hooks\CallStages;

use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\CallStages\HookCallStage;
use App\Hooks\CallStages\SettledCall;

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

    public function answeredBy(HookAnswer $answer): self
    {
        return clone ($this, ['answer' => $answer]);
    }

    public function settled(): SettledCall
    {
        return new SettledCall($this->call, $this->row, $this->answer);
    }
}
