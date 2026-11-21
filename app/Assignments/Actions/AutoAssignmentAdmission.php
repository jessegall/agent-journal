<?php

declare(strict_types=1);

namespace App\Assignments\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Exceptions\AutoAssignmentDenied;
use App\Assignments\Exceptions\AutoAssignmentPoolUnknown;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\PoolDefinition;

/**
 * The checks an auto-assignment change passes before anything is written: the acting actor may change the target's
 * auto-assignment, the target may hold records at all, and a pool is one its type's domains offer and accepts the
 * reference.
 */
final readonly class AutoAssignmentAdmission
{
    public function __construct(
        private CurrentActor $actors,
        private AutoAssignmentAccess $access,
        private AssignmentProviders $providers,
    ) {}

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     * @throws AssignmentTypeUnavailable
     * @throws AssigneeUnavailable
     */
    public function admitKey(AutoAssignmentKey $key): void
    {
        $this->providers->assertPublic($key->assignableType);
        $this->access->assertMayWrite($this->actors->actor(), $key->actor);
        $assignee = AssigneeIdentity::ofActorIdentity($key->actor);
        $this->providers->assigneeProvider($assignee->type)->requireEligible($assignee);
    }

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     * @throws AssignmentTypeUnavailable
     * @throws AssigneeUnavailable
     * @throws AutoAssignmentPoolUnknown
     */
    public function admitInput(AutoAssignmentInput $input): void
    {
        $this->admitKey($input->key);

        $offered = array_map(
            fn (PoolDefinition $pool) => $pool->key,
            $this->providers->pools($input->key->assignableType),
        );

        if (! in_array($input->pool->type, $offered, true)) {
            throw AutoAssignmentPoolUnknown::forType($input->key->assignableType);
        }

        $this->providers->poolFactory($input->pool->type)->validate($input->pool, $input->key->actor);
    }
}
