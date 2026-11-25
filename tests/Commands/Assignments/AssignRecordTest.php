<?php

declare(strict_types=1);

namespace Tests\Commands\Assignments;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\RequestKeyConflict;
use App\Models\Access\User;
use App\Models\Agents\AgentSession;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\RequestKey;
use Carbon\CarbonImmutable;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestIds;
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
        'agent_sessions',
        'session_tokens',
        'number_groups',
    ];

    private const string KEY = '01JD8X0G9M3QZ6V4K2CLIKEY001';

    private TestStart $helper;

    private Task $task;

    private TestStart $main;

    private User $owner;

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

    public function test_a_failed_cli_write_prints_its_request_key_to_retry_with(): void
    {
        $owner = $this->journal->ownerUser();
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->task = $this->tasks()->task('Keyed work')->taskCalled('Keyed work');

        $this->journal->relayAgentCommands($this->helper);

        $this->artisan(
            'assignment:assign',
            [
                'type' => 'tasks.task',
                'id' => $this->task->id,
                '--to' => "agent:{$this->main->agent->id}",
                '--request-key' => self::KEY,
            ],
        )
            ->expectsOutputToContain('--request-key='.self::KEY)
            ->assertExitCode(1);
    }

    public function test_the_admitted_user_assigns_over_the_web_as_itself_without_an_agent_session(): void
    {
        $this->owner = $this->journal->ownerUser();
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->task = $this->tasks()->task('Write the commands')->taskCalled('Write the commands');

        $other = $this->tasks()->task('For an agent')->taskCalled('For an agent');
        $sessions = AgentSession::query()->withoutGlobalScopes()->count();

        $this->actingAs($this->owner)->postJson(
            '/assignments/assign',
            [
                'recordType' => 'tasks.task',
                'recordId' => $this->task->id,
                'recipientType' => 'user',
                'recipientId' => $this->owner->id,
            ],
        )
            ->assertOk()->assertJson(
                ['outcomes' => [['record' => ['holder' => ['type' => 'user', 'id' => (string) $this->owner->id]]]]],
            );
        $this->actingAs($this->owner)->postJson(
            '/assignments/assign',
            [
                'recordType' => 'tasks.task',
                'recordId' => $other->id,
                'recipientType' => 'agent',
                'recipientId' => $this->helper->agent->id,
            ],
        )
            ->assertOk();
        $this->actingAs($this->owner)->getJson('/assignments/show?recordType=tasks.task&recordId='.$other->id)
            ->assertOk()->assertJson(['holder' => ['type' => 'agent', 'name' => 'Test agent']]);

        $this->assertSame($sessions, AgentSession::query()->withoutGlobalScopes()->count());
    }

    public function test_the_commands_send_the_same_calls_and_fail_on_a_refusal(): void
    {
        $this->owner = $this->journal->ownerUser();
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->task = $this->tasks()->task('Write the commands')->taskCalled('Write the commands');

        $this->journal->relayAgentCommands($this->main);

        $this->artisan(
            'assignment:assign',
            [
                'type' => 'tasks.task',
                'id' => $this->task->id,
                '--to' => "agent:{$this->helper->agent->id}",
                '--json' => true,
            ],
        )
            ->expectsOutputToContain('"changed":1')->assertExitCode(0);
        $this->artisan('assignment:show', ['type' => 'tasks.task', 'id' => $this->task->id, '--json' => true])
            ->expectsOutputToContain('"reference"')->assertExitCode(0);
        $this->artisan(
            'assignment:unassign',
            [
                'type' => 'tasks.task',
                'id' => $this->task->id,
                '--assignment' => TestIds::of(999999),
                '--holder' => "agent:{$this->helper->agent->id}",
            ],
        )
            ->expectsOutputToContain('The journal refused the call (')->assertExitCode(1);
        $this->artisan('assignment:assign', ['type' => 'tasks.task', 'id' => $this->task->id, '--to' => 'somebody'])
            ->expectsOutputToContain('type:id')->assertExitCode(1);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
