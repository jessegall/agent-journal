<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Exceptions\AutoAssignmentDenied;
use App\Assignments\Exceptions\AutoAssignmentPoolUnknown;
use App\Exceptions\AssigneeUnavailable;
use App\Exceptions\AssignmentDenied;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\CrossProjectEdge;
use App\Projects\ProjectEdges;
use App\Records\Contracts\RecordResolver;
use App\Support\AssigneeIdentity;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;

/**
 * The checks an auto-assignment change passes before anything is written: the acting actor may change the target's
 * auto-assignment, the target may hold records at all, a pool is one its type's domains offer and accepts the
 * reference, and a pool's target record is of the holder's project.
 */
final readonly class AutoAssignmentAdmission
{
    public function __construct(
        private CurrentActor $actors,
        private AutoAssignmentAccess $access,
        private AssignmentProviders $providers,
        private RecordResolver $records,
        private ProjectEdges $edges,
    ) {}

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     * @throws AssignmentTypeUnavailable
     * @throws AssigneeUnavailable
     */
    public function admitKey(AutoAssignmentKey $key): void
    {
        $this->eligibleHolder($key);
    }

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     * @throws AssignmentTypeUnavailable
     * @throws AssigneeUnavailable
     * @throws AutoAssignmentPoolUnknown
     * @throws CrossProjectEdge
     */
    public function admitInput(AutoAssignmentInput $input): void
    {
        $holder = $this->eligibleHolder($input->key);

        $offered = array_map(
            fn (PoolDefinition $pool) => $pool->key,
            $this->providers->pools($input->key->assignableType),
        );

        if (! in_array($input->pool->type, $offered, true)) {
            throw AutoAssignmentPoolUnknown::forType($input->key->assignableType);
        }

        $this->providers->poolFactory($input->pool->type)->validate($input->pool, $input->key->actor);

        if ($input->pool->target !== null) {
            $this->edges->assertJoinable($holder, $this->records->requireReadable($input->pool->target));
        }
    }

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     * @throws AssignmentTypeUnavailable
     * @throws AssigneeUnavailable
     */
    private function eligibleHolder(AutoAssignmentKey $key): Assignee
    {
        $this->providers->assertPublic($key->assignableType);
        $this->access->assertMayWrite($this->actors->actor(), $key->actor);
        $assignee = AssigneeIdentity::ofActorReference($key->actor);

        return $this->providers->assigneeProvider($assignee->type)->requireEligible($assignee);
    }
}
