<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\AssignRecord\AssignRecordCommand;
use App\Commands\ReassignRecord\ReassignRecordCommand;
use App\Contracts\Actors\Actor;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Bus\CommandBus;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\AssigneeIdentity;
use App\Support\Reflector;
use App\Support\RequestKey;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Work is held by an assignee identity, not an actor: an agent and a user are both assignees, and the assignment row
 * keeps the holder's type as the registered assignee type text.
 */
final class AssigneeIdentityTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'tasks', 'assignments', 'command_receipts'];

    public function test_an_assignee_is_not_an_actor_by_contract(): void
    {
        $this->assertFalse(Reflector::of(Assignee::class)->implements(Actor::class));
    }

    public function test_an_agent_and_a_user_are_assigned_and_reassigned_through_the_assign_command(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $agent = Agent::create('Builder', 'read-only-helper');
        $task = Task::factory()->create(['title' => 'Write the reader'])->assignmentIdentity();
        $this->startUserRequestAs($owner->id);
        $bus = $this->app->make(CommandBus::class);

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $toAgent = $bus->run(new AssignRecordCommand($task, $agent->assigneeIdentity()))->outcomes[0]->current;
        $this->assertTrue($toAgent->holder()->isSameAs(new AssigneeIdentity('agent', $agent->id)));

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $toUser = $bus->run(new ReassignRecordCommand($task, $toAgent->reference, $owner->assigneeIdentity()))
            ->outcomes[0]->current;
        $this->assertTrue($toUser->holder()->isSameAs(new AssigneeIdentity('user', (string) $owner->id)));

        $row = AssignmentRecord::query()->sole();
        $this->assertSame('user', $row->holder_type);
        $this->assertTrue($row->toAssignment->holder()->isSameAs($owner->assigneeIdentity()));
    }
}
