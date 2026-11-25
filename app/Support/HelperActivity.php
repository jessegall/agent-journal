<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Activity\ActivityLog;
use App\Enums\Agents\ActivityType;
use App\Models\Agents\Agent;

/**
 * Records in the activity log a helper an agent started and the helper's report when it finished, by its name.
 */
final readonly class HelperActivity
{
    public function __construct(private ActivityLog $activity) {}

    public function started(string $parentAgentId, string $helperAgentId): void
    {
        $this->record($parentAgentId, ActivityType::HelperStarted, $helperAgentId);
    }

    public function finished(string $agentId): void
    {
        $this->record($agentId, ActivityType::HelperFinished, $agentId);
    }

    private function record(string $actorAgentId, ActivityType $type, string $helperAgentId): void
    {
        $this->activity->record(
            ActorReference::ofClass(Agent::class, $actorAgentId),
            $type,
            Agent::query()->findOrFail($helperAgentId)->name,
        );
    }
}
