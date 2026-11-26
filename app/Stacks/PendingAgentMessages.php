<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Contracts\Work\PendingWorkSource;
use App\Models\Agents\PendingAgentMessage;
use App\Support\ActorReference;

/**
 * Counts the states' messages kept for an idle agent, so the wake they asked for is not settled as no work.
 */
final readonly class PendingAgentMessages implements PendingWorkSource
{
    public function pendingCount(ActorReference $actor): int
    {
        return PendingAgentMessage::countAttentionFor($actor);
    }
}
