<?php

declare(strict_types=1);

namespace App\Hooks\CallStages;

use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\CallStages\HookCallStage;
use App\Hooks\CallStages\WalkedCall;

/**
 * A hook call with its agent's stack restored as the call found it.
 */
final readonly class RestoredCall
{
    /**
     * @param  list<string>  $reminders
     */
    public function __construct(
        public HookCallStage $call,
        public AgentStackRow $row,
        public array $reminders,
        public AgentStack $stackBefore,
    ) {}

    /**
     * The call with the walk's final answer, the reminders put first in its context.
     */
    public function walked(HookAnswer $answer): WalkedCall
    {
        return new WalkedCall(
            $this->call,
            $this->row,
            $this->stackBefore,
            $answer->withRemindersFirst($this->reminders),
        );
    }
}
