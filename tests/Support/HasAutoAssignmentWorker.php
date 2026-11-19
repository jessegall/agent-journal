<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AutoAssignmentKey;
use Domain\Tasks\Api\TaskType;
use Tests\Fixtures\Agents\TestLaunch;

/**
 * A launched writing helper whose auto-assignment of tasks the test works with, under a request of the owner.
 */
trait HasAutoAssignmentWorker
{
    use ActsAsOwner;
    use StartsAgentRequests;

    private TestLaunch $worker;

    private AutoAssignmentKey $key;

    protected function setUpHasAutoAssignmentWorker(): void
    {
        $this->setUpActsAsOwner();
        $this->worker = TestLaunch::start('writing-helper');
        $this->key = new AutoAssignmentKey(ActorIdentity::of($this->worker->agent), TaskType::VALUE);
        $this->startUserRequestAs($this->owner->id);
    }
}
