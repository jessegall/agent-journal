<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Enums\Assignments\ActorType;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorStore;
use App\Support\AssigneeIdentity;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Assignments are seen by a signed-in user or agent only: nobody acting and the system acting see none.
 */
final class SignedInScopeTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    protected function setUp(): void
    {
        parent::setUp();

        AssignmentRecord::createForFreeRecord(
            TestActors::record('tasks.task', 1),
            new AssigneeIdentity(ActorType::Agent->value, TestIds::of(2)),
        );
    }

    public function test_a_signed_in_user_and_agent_see_assignments_and_the_system_sees_none(): void
    {
        $this->startTestUserRequest(9);
        $store = $this->app->make(ActorStore::class);

        $this->assertCount(1, AssignmentRecord::query()->get());
        $this->assertCount(0, $store->actAsSystem('test', fn () => AssignmentRecord::query()->get()));

        $this->app->forgetScopedInstances();
        $this->startTestAgentRequest(2, 20);

        $this->assertCount(1, AssignmentRecord::query()->get());
    }

    public function test_nobody_acting_sees_no_assignment(): void
    {
        $this->assertCount(0, AssignmentRecord::query()->get());
    }
}
