<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Models\Agent;
use App\Models\AgentSession;
use App\Models\AssignmentRecord;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestIds;
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

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'start_tokens', 'tasks', 'assignments'];

    private User $owner;

    private TestStart $main;

    private TestStart $helper;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->task = Task::factory()->create(['title' => 'Write the commands']);
    }

    public function test_a_main_agent_reads_the_reference_and_deliberately_changes_the_work(): void
    {
        $record = ['record_type' => 'tasks.task', 'record_id' => $this->task->id];

        $this->callAs(
            $this->main,
            'assign',
            [...$record, 'recipient_type' => 'agent', 'recipient_id' => $this->helper->agent->id],
        )
            ->assertOk()->assertJson(
                [
                    'changed' => 1,
                    'outcomes' => [
                        [
                            'type' => 'changed',
                            'record' => ['holder' => ['type' => 'agent', 'id' => (string) $this->helper->agent->id]],
                        ],
                    ],
                ],
            );
        $shown = $this->callAs($this->main, 'show', $record)->assertOk();
        $first = (string) $shown->json('holder.reference');

        $this->callAs(
            $this->main,
            'reassign',
            [
                ...$record,
                'assignment_id' => $first,
                'holder_type' => 'agent',
                'holder_id' => $this->helper->agent->id,
                'recipient_type' => 'agent',
                'recipient_id' => $this->main->agent->id,
            ],
        )
            ->assertOk()->assertJson(['changed' => 1]);
        $second = (string) $this->callAs($this->main, 'show', $record)->json('holder.reference');
        $this->callAs(
            $this->main,
            'reassign',
            [
                ...$record,
                'assignment_id' => $second,
                'holder_type' => 'agent',
                'holder_id' => $this->main->agent->id,
                'recipient_type' => 'agent',
                'recipient_id' => $this->helper->agent->id,
            ],
        )->assertOk();

        $this->callAs(
            $this->main,
            'unassign',
            [...$record, 'assignment_id' => $first, 'holder_type' => 'agent', 'holder_id' => $this->helper->agent->id],
        )->assertConflict();
        $this->callAs(
            $this->helper,
            'unassign',
            [...$record, 'assignment_id' => $first, 'holder_type' => 'agent', 'holder_id' => $this->helper->agent->id],
        )->assertForbidden();
        $this->callAs(
            $this->main,
            'assign',
            [
                ...$record,
                'recipient_type' => 'agent',
                'recipient_id' => $this->helper->agent->id,
                'agent' => $this->helper->agent->id,
            ],
        )->assertUnprocessable();

        $this->assertSame(1, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_the_admitted_user_assigns_over_the_web_as_itself_without_an_agent_session(): void
    {
        $other = Task::factory()->create(['title' => 'For an agent']);
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

    public function test_retirement_is_open_to_the_user_over_the_web_and_to_a_main_agent_over_a_signed_call(): void
    {
        $spare = Agent::create('Spare', 'read-only-helper');
        $this->actingAs($this->owner)->postJson(
            '/assignments/assign',
            [
                'recordType' => 'tasks.task',
                'recordId' => $this->task->id,
                'recipientType' => 'agent',
                'recipientId' => $this->helper->agent->id,
            ],
        )->assertOk();

        $this->signed(
            $this->main,
            '/agent/agents/retire',
            ['agentId' => $this->main->agent->id, 'request_key' => 'retire-1'],
        )->assertForbidden();
        $this->signed(
            $this->main,
            '/agent/agents/retire',
            ['agentId' => $this->helper->agent->id, 'request_key' => 'retire-2'],
        )->assertOk()->assertJson(['changed' => 1]);
        $this->actingAs($this->owner)->postJson(
            '/agents/retire',
            ['agentId' => $spare->id],
        )->assertOk()->assertJson(['changed' => 0]);

        $this->assertTrue($this->helper->agent->refresh()->isRetired());
        $this->assertTrue($spare->refresh()->isRetired());
    }

    public function test_the_commands_send_the_same_calls_and_fail_on_a_refusal(): void
    {
        $this->runCommandsAs($this->main);

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

    /**
     * @param  array<string, mixed>  $body
     */
    private function callAs(TestStart $start, string $command, array $body): TestResponse
    {
        $key = $command === 'show' ? [] : ['request_key' => (string) Str::ulid()];

        return $this->signed($start, "/agent/assignments/{$command}", [...$body, ...$key]);
    }
}
