<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use App\Core\Agents\Support\AgentClientSettings;
use App\Core\Assignments\Models\AssignmentRecord;
use App\Core\Contracts\CurrentActorSetter;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Tasks\Models\Task;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * One record at a time: a main agent reads a record's holder and reference and deliberately gives, moves or releases
 * it over signed calls, a stale reference is refused even when the same holder came back, and a helper may not change
 * work; the admitted user does the same over the web as itself, and retirement has both entry points.
 */
final class SingleRecordCommandsTest extends TestCase
{
    use CommitsHookRows;

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

        $this->callAs($this->main, 'assign', [...$record, 'recipientKind' => 'agent', 'recipientId' => $this->helper->agent->id])
            ->assertOk()->assertJson(['changed' => 1, 'outcomes' => [['kind' => 'changed', 'record' => ['holder' => ['kind' => 'agent', 'id' => (string) $this->helper->agent->id]]]]]);
        $shown = $this->callAs($this->main, 'show', $record)->assertOk();
        $first = (int) $shown->json('holder.reference');

        $this->callAs($this->main, 'reassign', [...$record, 'assignmentId' => $first, 'holderKind' => 'agent', 'holderId' => $this->helper->agent->id, 'recipientKind' => 'agent', 'recipientId' => $this->main->agent->id])
            ->assertOk()->assertJson(['changed' => 1]);
        $second = (int) $this->callAs($this->main, 'show', $record)->json('holder.reference');
        $this->callAs($this->main, 'reassign', [...$record, 'assignmentId' => $second, 'holderKind' => 'agent', 'holderId' => $this->main->agent->id, 'recipientKind' => 'agent', 'recipientId' => $this->helper->agent->id])->assertOk();

        $this->callAs($this->main, 'unassign', [...$record, 'assignmentId' => $first, 'holderKind' => 'agent', 'holderId' => $this->helper->agent->id])->assertConflict();
        $this->callAs($this->helper, 'unassign', [...$record, 'assignmentId' => $first, 'holderKind' => 'agent', 'holderId' => $this->helper->agent->id])->assertForbidden();
        $this->callAs($this->main, 'assign', [...$record, 'recipientKind' => 'agent', 'recipientId' => $this->helper->agent->id, 'agent' => $this->helper->agent->id])->assertUnprocessable();

        $this->assertSame(1, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_the_admitted_user_assigns_over_the_web_as_itself_without_an_agent_session(): void
    {
        $other = Task::query()->create(['title' => 'For an agent']);
        $sessions = AgentSession::query()->withoutGlobalScopes()->count();

        $this->actingAs($this->owner)->postJson('/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $this->task->id, 'recipientKind' => 'user', 'recipientId' => $this->owner->id])
            ->assertOk()->assertJson(['outcomes' => [['record' => ['holder' => ['kind' => 'user', 'id' => (string) $this->owner->id]]]]]);
        $this->actingAs($this->owner)->postJson('/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $other->id, 'recipientKind' => 'agent', 'recipientId' => $this->helper->agent->id])
            ->assertOk();
        $this->actingAs($this->owner)->getJson('/assignments/show?recordType=tasks.task&recordId='.$other->id)
            ->assertOk()->assertJson(['holder' => ['kind' => 'agent', 'name' => 'Test agent']]);

        $this->assertSame($sessions, AgentSession::query()->withoutGlobalScopes()->count());
    }

    public function test_retirement_is_open_to_the_user_over_the_web_and_to_a_main_agent_over_a_signed_call(): void
    {
        $spare = Agent::query()->create(['name' => 'Spare', 'role' => 'hooks.read_only_helper_ready']);
        $this->actingAs($this->owner)->postJson('/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $this->task->id, 'recipientKind' => 'agent', 'recipientId' => $this->helper->agent->id])->assertOk();

        $this->signed($this->main, '/agent/agents/retire', ['agentId' => $this->main->agent->id])->assertForbidden();
        $this->signed($this->main, '/agent/agents/retire', ['agentId' => $this->helper->agent->id])->assertOk()->assertJson(['changed' => 1]);
        $this->actingAs($this->owner)->postJson('/agents/retire', ['agentId' => $spare->id])->assertOk()->assertJson(['changed' => 0]);

        $this->assertTrue($this->helper->agent->refresh()->isRetired());
        $this->assertTrue($spare->refresh()->isRetired());
    }

    public function test_the_commands_send_the_same_calls_and_fail_on_a_refusal(): void
    {
        $this->useLaunch($this->main);

        $this->artisan('assignment:assign', ['type' => 'tasks.task', 'id' => $this->task->id, '--to' => "agent:{$this->helper->agent->id}", '--json' => true])
            ->expectsOutputToContain('"changed":1')->assertExitCode(0);
        $this->artisan('assignment:show', ['type' => 'tasks.task', 'id' => $this->task->id, '--json' => true])
            ->expectsOutputToContain('"reference"')->assertExitCode(0);
        $this->artisan('assignment:unassign', ['type' => 'tasks.task', 'id' => $this->task->id, '--assignment' => 999999, '--holder' => "agent:{$this->helper->agent->id}"])
            ->expectsOutputToContain('(409)')->assertExitCode(1);
        $this->artisan('assignment:assign', ['type' => 'tasks.task', 'id' => $this->task->id, '--to' => 'somebody'])
            ->expectsOutputToContain('kind:id')->assertExitCode(1);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function callAs(TestLaunch $launch, string $command, array $body): TestResponse
    {
        return $this->signed($launch, "/agent/assignments/{$command}", $body);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(TestLaunch $launch, string $path, array $body): TestResponse
    {
        $this->app->make(CurrentActorSetter::class)->clear();
        $this->app->forgetScopedInstances();
        $content = json_encode((object) $body) ?: '{}';

        return $this->call('POST', $path, server: $launch->serverHeaders($content, 'call-'.bin2hex(random_bytes(4))), content: $content);
    }

    /**
     * Gives the commands the launch's settings and sends their signed calls through the application's own HTTP kernel.
     */
    private function useLaunch(TestLaunch $launch): void
    {
        $this->app->instance(AgentClientSettings::class, new AgentClientSettings('http://journal.test', $launch->token));
        Http::fake(function (Request $request) {
            $server = ['CONTENT_TYPE' => 'application/json'];

            foreach ($request->headers() as $name => $values) {
                $server['HTTP_'.strtoupper(str_replace('-', '_', $name))] = $values[0];
            }

            $this->app->make(CurrentActorSetter::class)->clear();
            $this->app->forgetScopedInstances();
            $response = $this->call('POST', (string) parse_url($request->url(), PHP_URL_PATH), server: $server, content: $request->body());

            return Http::response((string) $response->getContent(), $response->getStatusCode());
        });
    }
}
