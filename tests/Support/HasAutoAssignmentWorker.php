<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\ActorIdentity;
use App\Support\AutoAssignmentKey;
use Domain\Tasks\Support\TaskType;
use Tests\Fixtures\Agents\TestStart;

/**
 * A started writing helper whose auto-assignment of tasks the test works with, under a request of the owner.
 */
trait HasAutoAssignmentWorker
{
    use ActsAsOwner;
    use StartsAgentRequests;

    private TestStart $worker;

    private AutoAssignmentKey $key;

    protected function setUpHasAutoAssignmentWorker(): void
    {
        $this->setUpActsAsOwner();
        $this->worker = TestStart::start('writing-helper');
        $this->key = new AutoAssignmentKey(ActorIdentity::of($this->worker->agent), TaskType::linkType());
        $this->startUserRequestAs($this->owner->id);
    }
}
