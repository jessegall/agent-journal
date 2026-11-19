<?php

declare(strict_types=1);

namespace App\Hooks\Values\Answer;

use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\AgentStack;

/**
 * A hook call answered for the first time, with the reminders its context start brings.
 */
final readonly class PreparedCall
{
    /**
     * @param  list<string>  $reminders
     */
    public function __construct(
        public HookCallStage $call,
        public AgentStackRow $row,
        public array $reminders,
    ) {}

    public function restored(AgentStack $stackBefore): RestoredCall
    {
        return new RestoredCall($this->call, $this->row, $this->reminders, $stackBefore);
    }
}
