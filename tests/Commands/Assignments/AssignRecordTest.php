<?php

declare(strict_types=1);

namespace Tests\Commands\Assignments;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\RequestKeyConflict;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\RequestKey;
use Carbon\CarbonImmutable;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * A record given to an actor at main is held by main and names both, an actor in no forwarding inbox keeps it, and
 * a changed recipient under the same key conflicts.
 */
final class AssignRecordTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'tasks',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installInboxes();

        $this->journal->owner();
    }

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
        $agent = $this->journal->idleAgent('Main', 'main-agent')->agentCalled('Main');
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
        $agent = $this->journal->idleAgent('Builder', 'read-only-helper')->agentCalled('Builder');
        $task = Task::factory()->create()->assignmentIdentity();

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->app->make(CommandBus::class)->run(new AssignRecordCommand($task, $agent->assigneeIdentity()));

        $held = AssignmentRecord::query()->forRecord($task)->sole()->toAssignment->holder();
        $this->assertTrue($held->isSameAs($agent->assigneeIdentity()));
    }

    public function test_a_changed_recipient_under_the_same_key_conflicts(): void
    {
        $builder = $this->journal->idleAgent('Builder', 'read-only-helper')->agentCalled('Builder');
        $reviewer = $this->journal->idleAgent('Reviewer', 'read-only-helper')->agentCalled('Reviewer');
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
}
