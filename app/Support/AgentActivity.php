<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AutoAssignmentActivity;
use App\Models\Agent;
use App\Models\AgentSession;

/**
 * An agent may take work while it is not retired and one of its sessions still runs; a silent session still runs,
 * since heartbeat silence is not an end.
 */
final readonly class AgentActivity implements AutoAssignmentActivity
{
    public function mayTakeWork(ActorIdentity $actor): bool
    {
        $agent = Agent::query()->find($actor->id);

        if ($agent === null || $agent->isRetired()) {
            return false;
        }

        return AgentSession::query()->runningFor($agent->id)->exists();
    }
}
