<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
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

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'session_tokens', 'tasks', 'assignments'];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    private User $owner;

    private TestStart $main;

    private TestStart $helper;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->task = $this->tasks()->task('Write the commands')->taskCalled('Write the commands');
    }

    public function test_the_admitted_user_assigns_over_the_web_as_itself_without_an_agent_session(): void
    {
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

    public function test_retirement_is_open_to_the_user_over_the_web_and_to_a_main_agent_over_a_signed_call(): void
    {
        $spare = Agent::create('Spare', 'read-only-helper', $this->localProject());
        $this->actingAs($this->owner)->postJson(
            '/assignments/assign',
            [
                'recordType' => 'tasks.task',
                'recordId' => $this->task->id,
                'recipientType' => 'agent',
                'recipientId' => $this->helper->agent->id,
            ],
        )->assertOk();

        $this->journal->agentCall(
            $this->main,
            'POST',
            '/agent/agents/retire',
            ['agentId' => $this->main->agent->id, 'request_key' => 'retire-1'],
        )->assertForbidden();
        $this->journal->agentCall(
            $this->main,
            'POST',
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
