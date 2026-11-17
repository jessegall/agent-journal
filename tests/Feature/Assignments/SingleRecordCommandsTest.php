<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use App\Core\Assignments\Models\AssignmentRecord;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Tasks\Models\Task;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * One record at a time: a main agent reads a record's holder and reference and deliberately gives, moves or releases
 * it over signed calls, a stale reference is refused even when the same holder came back, and a helper may not change
 * work; the admitted user does the same over the web as itself, and retirement has both entry points.
 */
final class SingleRecordCommandsTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'launch_credentials', 'tasks', 'assignments'];

    private User $owner;

    private TestLaunch $main;

    private TestLaunch $helper;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->main = TestLaunch::start('hooks.main_ready');
        $this->helper = TestLaunch::start('hooks.read_only_helper_ready');
        $this->task = Task::query()->create(['title' => 'Write the commands']);
    }

    public function test_a_main_agent_reads_the_reference_and_deliberately_changes_the_work(): void
    {
        $record = ['recordType' => 'tasks.task', 'recordId' => $this->task->id];

        $this->callAs($this->main, 'assign', [...$record, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id])
            ->assertOk()->assertJson(['changed' => 1, 'outcomes' => [['type' => 'changed', 'record' => ['holder' => ['type' => 'agent', 'id' => (string) $this->helper->agent->id]]]]]);
        $shown = $this->callAs($this->main, 'show', $record)->assertOk();
        $first = (int) $shown->json('holder.reference');

        $this->callAs($this->main, 'reassign', [...$record, 'assignmentId' => $first, 'holderType' => 'agent', 'holderId' => $this->helper->agent->id, 'recipientType' => 'agent', 'recipientId' => $this->main->agent->id])
            ->assertOk()->assertJson(['changed' => 1]);
        $second = (int) $this->callAs($this->main, 'show', $record)->json('holder.reference');
        $this->callAs($this->main, 'reassign', [...$record, 'assignmentId' => $second, 'holderType' => 'agent', 'holderId' => $this->main->agent->id, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id])->assertOk();

        $this->callAs($this->main, 'unassign', [...$record, 'assignmentId' => $first, 'holderType' => 'agent', 'holderId' => $this->helper->agent->id])->assertConflict();
        $this->callAs($this->helper, 'unassign', [...$record, 'assignmentId' => $first, 'holderType' => 'agent', 'holderId' => $this->helper->agent->id])->assertForbidden();
        $this->callAs($this->main, 'assign', [...$record, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id, 'agent' => $this->helper->agent->id])->assertUnprocessable();

        $this->assertSame(1, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_the_admitted_user_assigns_over_the_web_as_itself_without_an_agent_session(): void
    {
        $other = Task::query()->create(['title' => 'For an agent']);
        $sessions = AgentSession::query()->withoutGlobalScopes()->count();

        $this->actingAs($this->owner)->postJson('/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $this->task->id, 'recipientType' => 'user', 'recipientId' => $this->owner->id])
            ->assertOk()->assertJson(['outcomes' => [['record' => ['holder' => ['type' => 'user', 'id' => (string) $this->owner->id]]]]]);
        $this->actingAs($this->owner)->postJson('/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $other->id, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id])
            ->assertOk();
        $this->actingAs($this->owner)->getJson('/assignments/show?recordType=tasks.task&recordId='.$other->id)
            ->assertOk()->assertJson(['holder' => ['type' => 'agent', 'name' => 'Test agent']]);

        $this->assertSame($sessions, AgentSession::query()->withoutGlobalScopes()->count());
    }

    public function test_retirement_is_open_to_the_user_over_the_web_and_to_a_main_agent_over_a_signed_call(): void
    {
        $spare = Agent::query()->create(['name' => 'Spare', 'role' => 'hooks.read_only_helper_ready']);
        $this->actingAs($this->owner)->postJson('/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $this->task->id, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id])->assertOk();

        $this->signed($this->main, '/agent/agents/retire', ['agentId' => $this->main->agent->id])->assertForbidden();
        $this->signed($this->main, '/agent/agents/retire', ['agentId' => $this->helper->agent->id])->assertOk()->assertJson(['changed' => 1]);
        $this->actingAs($this->owner)->postJson('/agents/retire', ['agentId' => $spare->id])->assertOk()->assertJson(['changed' => 0]);

        $this->assertTrue($this->helper->agent->refresh()->isRetired());
        $this->assertTrue($spare->refresh()->isRetired());
    }

    public function test_the_commands_send_the_same_calls_and_fail_on_a_refusal(): void
    {
        $this->runCommandsAs($this->main->token);

        $this->artisan('assignment:assign', ['type' => 'tasks.task', 'id' => $this->task->id, '--to' => "agent:{$this->helper->agent->id}", '--json' => true])
            ->expectsOutputToContain('"changed":1')->assertExitCode(0);
        $this->artisan('assignment:show', ['type' => 'tasks.task', 'id' => $this->task->id, '--json' => true])
            ->expectsOutputToContain('"reference"')->assertExitCode(0);
        $this->artisan('assignment:unassign', ['type' => 'tasks.task', 'id' => $this->task->id, '--assignment' => 999999, '--holder' => "agent:{$this->helper->agent->id}"])
            ->expectsOutputToContain('(409)')->assertExitCode(1);
        $this->artisan('assignment:assign', ['type' => 'tasks.task', 'id' => $this->task->id, '--to' => 'somebody'])
            ->expectsOutputToContain('type:id')->assertExitCode(1);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function callAs(TestLaunch $launch, string $command, array $body): TestResponse
    {
        return $this->signed($launch, "/agent/assignments/{$command}", $body);
    }
}
