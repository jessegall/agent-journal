<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use Domain\Plans\Exceptions\PlanUnderReview;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Events\TaskDescribed;

/**
 * Refuses a new title or brief for a task whose plan is under review, inside the transaction that changed it, so the
 * change rolls back; a task in no phase is never refused.
 */
#[InCommandTransaction]
final readonly class RefuseTaskChangeUnderReview implements Listener
{
    /**
     * @throws PlanUnderReview
     */
    public function handle(TaskDescribed $event): void
    {
        $planId = Phase::query()->holdingTask($event->taskId)->value('plan_id');

        if ($planId === null) {
            return;
        }

        Plan::lockForChange((string) $planId);
    }
}
