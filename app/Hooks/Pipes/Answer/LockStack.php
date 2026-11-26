<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\HookCallStage;
use App\Hooks\CallStages\LockedCall;
use App\Models\Agents\AgentStackRow;

/**
 * Locks the calling agent's stack row before anything else of the call is read or changed.
 */
final readonly class LockStack implements Pipe
{
    public function handle(HookCallStage $call): LockedCall
    {
        return $call->locked(AgentStackRow::findLockedFor($call->target));
    }
}
