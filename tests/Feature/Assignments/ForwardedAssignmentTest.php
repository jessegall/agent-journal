<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Commands\Assignments\UnassignRecord\UnassignRecordCommand;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\RequestKeyConflict;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\ActorProvisioning;
use App\Support\RequestKey;
use Carbon\CarbonImmutable;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsInboxes;
use Tests\Support\StartsOwnerRequest;
use Tests\TestCase;

/**
 * A task given to the actor attached to main is held by main, and the outcome names both the actor asked for and the
 * inbox that holds it; an actor in no forwarding inbox keeps the task itself.
 */
final class ForwardedAssignmentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsInboxes;
    use StartsOwnerRequest;

    private const array TABLES = [
        'users',
        'agents',
        'tasks',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_task_given_to_the_actor_at_main_is_held_by_main_and_names_both(): void
    {
        $main = Inbox::findMain();
        $agent = $this->withInbox(Agent::create('Main', 'main-agent', $this->localProject()));
        InboxMember::create($main->id, ActorIdentity::of($agent), CarbonImmutable::now());
        $task = Task::factory()->create()->assignmentIdentity();

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $result = $this->app->make(CommandBus::class)->run(new AssignRecordCommand($task, $agent->assigneeIdentity()));

        $held = AssignmentRecord::query()->forRecord($task)->sole()->toAssignment->holder();
        $this->assertTrue($held->isSameAs($main->assigneeIdentity()));
        $this->assertTrue($result->requests[0]->requested->isSameAs($agent->assigneeIdentity()));
        $this->assertTrue($result->requests[0]->resolved->isSameAs($main->assigneeIdentity()));
    }

    public function test_an_actor_in_no_forwarding_inbox_keeps_the_task(): void
    {
        $agent = $this->withInbox(Agent::create('Builder', 'read-only-helper', $this->localProject()));
        $task = Task::factory()->create()->assignmentIdentity();

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->app->make(CommandBus::class)->run(new AssignRecordCommand($task, $agent->assigneeIdentity()));

        $held = AssignmentRecord::query()->forRecord($task)->sole()->toAssignment->holder();
        $this->assertTrue($held->isSameAs($agent->assigneeIdentity()));
    }

    public function test_a_retry_with_the_same_key_returns_the_first_result_after_the_assignment_was_removed(): void
    {
        $agent = $this->withInbox(Agent::create('Builder', 'read-only-helper', $this->localProject()));
        $task = Task::factory()->create()->assignmentIdentity();
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(RequestKey::class)->set('assign-the-builder');
        $first = $bus->run(new AssignRecordCommand($task, $agent->assigneeIdentity()));
        $this->app->make(RequestKey::class)->set('unassign-the-builder');
        $bus->run(new UnassignRecordCommand($task, $first->outcomes[0]->current->reference));

        $this->app->make(RequestKey::class)->set('assign-the-builder');
        $retry = $bus->run(new AssignRecordCommand($task, $agent->assigneeIdentity()));

        $this->assertEquals($first, $retry);
        $this->assertSame(0, AssignmentRecord::query()->forRecord($task)->count());
    }

    public function test_a_changed_recipient_under_the_same_key_conflicts(): void
    {
        $builder = $this->withInbox(Agent::create('Builder', 'read-only-helper', $this->localProject()));
        $reviewer = $this->withInbox(Agent::create('Reviewer', 'read-only-helper', $this->localProject()));
        $task = Task::factory()->create()->assignmentIdentity();
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(RequestKey::class)->set('assign-once');
        $bus->run(new AssignRecordCommand($task, $builder->assigneeIdentity()));

        $this->app->make(RequestKey::class)->set('assign-once');

        $this->assertThrows(
            fn () => $bus->run(new AssignRecordCommand($task, $reviewer->assigneeIdentity())),
            RequestKeyConflict::class,
        );
    }

    private function withInbox(Agent $agent): Agent
    {
        $this->app->make(ActorProvisioning::class)->provision(ActorIdentity::of($agent), $agent->name);

        return $agent;
    }
}
