<?php

declare(strict_types=1);

namespace Tests\Commands\Assignments;

use App\Assignments\Commands\AssignRecord\AssignRecordCommand;
use App\Assignments\Commands\ReassignRecord\ReassignRecordCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Exceptions\CrossProjectEdge;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\AssigneeIdentity;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * An agent and a user are assigned a record and it is reassigned from one to the other.
 */
#[TestsCommand(ReassignRecordCommand::class)]
final class ReassignRecordTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'agents', 'tasks', 'assignments', 'command_receipts'];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_an_agent_and_a_user_are_assigned_and_reassigned_through_the_assign_command(): void
    {
        $owner = $this->journal->owner()->ownerUser();
        $agent = $this->journal->idleAgent('Builder', 'read-only-helper')->agentCalled('Builder');
        $task = Task::factory()->create(['title' => 'Write the reader'])->assignmentIdentity();
        $this->journal->actAsUserId($owner->id);
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

    public function test_a_reassignment_to_an_agent_of_another_project_is_refused_and_the_holder_stays(): void
    {
        $owner = $this->journal->owner()->project('Shop')->ownerUser();
        $agent = $this->journal->idleAgent('Builder', 'read-only-helper')->agentCalled('Builder');
        $stranger = $this->journal->idleAgent('Shopper', 'read-only-helper', 'Shop')->agentCalled('Shopper');
        $task = Task::factory()->create(['title' => 'Write the reader'])->assignmentIdentity();
        $this->journal->actAsUserId($owner->id);
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $held = $bus->run(new AssignRecordCommand($task, $agent->assigneeIdentity()))->outcomes[0]->current;

        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        $this->assertThrows(
            fn () => $bus->run(new ReassignRecordCommand($task, $held->reference, $stranger->assigneeIdentity())),
            CrossProjectEdge::class,
        );
        $this->assertSame($agent->id, AssignmentRecord::query()->sole()->holder_id);
    }
}
