<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Pipe;
use App\Models\Agents\AgentStackRow;
use App\Support\CallStages\HookCallStage;
use App\Support\CallStages\LockedCall;

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
