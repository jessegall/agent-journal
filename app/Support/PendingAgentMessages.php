<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\PendingWorkSource;
use App\Models\PendingAgentMessage;

/**
 * Counts the states' messages kept for an idle agent, so the wake they asked for is not settled as no work.
 */
final readonly class PendingAgentMessages implements PendingWorkSource
{
    public function pendingCount(ActorIdentity $actor): int
    {
        return PendingAgentMessage::countAttentionFor($actor);
    }
}
