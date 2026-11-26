<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\HelperActivity;
use App\Contracts\Events\Listener;
use App\Events\Sessions\StartAccepted;

/**
 * Records a helper an agent started in the agent's activity.
 */
final readonly class RecordHelperStart implements Listener
{
    public function __construct(private HelperActivity $activity) {}

    public function handle(StartAccepted $fact): void
    {
        if ($fact->parentAgentId === null) {
            return;
        }

        $this->activity->started($fact->parentAgentId, $fact->agentId);
    }
}
