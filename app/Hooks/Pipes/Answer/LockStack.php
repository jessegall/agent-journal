<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\Models\AgentStackRow;
use App\Hooks\Values\Answer\HookCallStage;
use App\Hooks\Values\Answer\LockedCall;
use App\Pipelines\Contracts\Pipe;

/**
 * Locks the calling agent's stack row before anything else of the call is read or changed.
 */
final readonly class LockStack implements Pipe
{
    public function handle(HookCallStage $call): LockedCall
    {
        return $call->locked(AgentStackRow::lockFor($call->target));
    }
}
