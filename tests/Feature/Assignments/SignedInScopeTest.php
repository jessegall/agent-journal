<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\ActorStore;
use App\Assignments\Models\AssignmentRecord;
use App\Records\Support\RecordIdentity;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
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

        AssignmentRecord::insertUnlessHeld(new RecordIdentity('tasks.task', TestIds::of(1)), new ActorIdentity(ActorType::Agent, TestIds::of(2)));
    }

    public function test_a_signed_in_user_and_agent_see_assignments_and_the_system_sees_none(): void
    {
        $this->startUserRequestAs(TestIds::of(9));
        $store = $this->app->make(ActorStore::class);

        $this->assertCount(1, AssignmentRecord::query()->get());
        $this->assertCount(0, $store->actAsSystem(fn () => AssignmentRecord::query()->get()));

        $this->app->forgetScopedInstances();
        $this->startRequestAs(TestIds::of(2), TestIds::of(20));

        $this->assertCount(1, AssignmentRecord::query()->get());
    }

    public function test_nobody_acting_sees_no_assignment(): void
    {
        $this->assertCount(0, AssignmentRecord::query()->get());
    }
}
