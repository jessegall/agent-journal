<?php

declare(strict_types=1);

namespace Domain\Plans\Support\Assignments;

use App\Contracts\Assignments\AssignmentPool;
use App\Contracts\Assignments\AssignmentPoolFactory;
use App\Enums\PoolInputType;
use App\Exceptions\AssignmentPoolTooLarge;
use App\Exceptions\AssignmentPoolUnavailable;
use App\Support\ActorIdentity;
use App\Support\PoolDescription;
use App\Support\PoolMembers;
use App\Support\PoolReference;
use App\Support\RecordIdentity;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\PlanPoolRefused;
use Domain\Plans\Models\Plan;
use Illuminate\Container\Attributes\Scoped;

/**
 * The pool plans.tasks: the tasks of one plan, given out phase by phase while the plan is started.
 */
#[Scoped]
final readonly class PlanTaskPoolFactory implements AssignmentPoolFactory
{
    public const string KEY = 'plans.tasks';

    /**
     * @throws PlanPoolRefused
     * @throws PlanMissing
     * @throws AssignmentPoolUnavailable
     * @throws AssignmentPoolTooLarge
     */
    public function open(PoolReference $pool, ActorIdentity $assignee): AssignmentPool
    {
        return new PlanTaskPool(PoolMembers::ordered($this->plan($pool)->poolTaskIds()));
    }

    /**
     * @throws PlanPoolRefused
     * @throws PlanMissing
     */
    public function validate(PoolReference $pool, ActorIdentity $assignee): void
    {
        $this->plan($pool);
    }

    /**
     * @throws PlanPoolRefused
     * @throws PlanMissing
     */
    public function describe(PoolReference $pool, ActorIdentity $assignee): PoolDescription
    {
        $plan = $this->plan($pool);

        return new PoolDescription(
            'Tasks in a started plan',
            "The tasks of plan {$plan->number}, {$plan->title}, phase by phase.",
            PoolInputType::Target,
        );
    }

    /**
     * The plan the reference names, once its shape fits this pool.
     *
     * @throws PlanPoolRefused
     * @throws PlanMissing
     */
    private function plan(PoolReference $pool): Plan
    {
        if ($pool->type !== self::KEY) {
            throw PlanPoolRefused::otherPool(self::KEY);
        }

        if ($pool->recordIds !== []) {
            throw PlanPoolRefused::idsGiven(self::KEY);
        }

        if (! $pool->target instanceof RecordIdentity || $pool->target->type !== Plan::linkType()) {
            throw PlanPoolRefused::noPlanTarget(self::KEY);
        }

        return Plan::query()->findOr($pool->target->id, PlanMissing::throwing()->withId($pool->target->id));
    }
}
