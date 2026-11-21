<?php

declare(strict_types=1);

namespace App\Hooks\CallStages;

use App\Hooks\Models\AgentStackRow;

/**
 * A hook call holding its agent's locked stack row.
 */
final readonly class LockedCall
{
    public function __construct(
        public HookCallStage $call,
        public AgentStackRow $row,
    ) {}

    /**
     * @param  list<string>  $reminders
     */
    public function prepared(array $reminders): PreparedCall
    {
        return new PreparedCall($this->call, $this->row, $reminders);
    }
}
