<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Activity\ActivityLog;
use App\Contracts\Events\Listener;
use App\Enums\ActivityType;
use App\Enums\ActorType;
use App\Events\HelperReportedOnRecord;
use App\Events\StartAccepted;
use App\Models\Agent;
use App\Support\ActorIdentity;

/**
 * Records a helper an agent started, and the helper's report when it finished, by the helper's name.
 */
final readonly class HelperActivityRecorder implements Listener
{
    public function __construct(private ActivityLog $activity) {}

    public function handle(StartAccepted|HelperReportedOnRecord $fact): void
    {
        if ($fact instanceof HelperReportedOnRecord) {
            $this->record($fact->helperAgentId, ActivityType::HelperFinished, $fact->helperAgentId);

            return;
        }

        if ($fact->parentAgentId === null) {
            return;
        }

        $this->record($fact->parentAgentId, ActivityType::HelperStarted, $fact->agentId);
    }

    private function record(string $actorAgentId, ActivityType $type, string $helperAgentId): void
    {
        $this->activity->record(
            new ActorIdentity(ActorType::Agent, $actorAgentId),
            $type,
            Agent::query()->findOrFail($helperAgentId)->name,
        );
    }
}
