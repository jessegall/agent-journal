<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Actions\LaunchStacks;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Models\HookCall;
use App\Hooks\Support\StackTransaction;
use App\Processes\Values\AdmissionRefusal;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Models\Task;
use Illuminate\Http\Response;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

final class HookEndpointTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'tasks', 'links', 'program_conversations', 'conversation_visits', 'process_events', 'part_runs', 'process_runs', 'command_requests'];

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        config(['processes.runner' => true]);
        $this->launch = TestLaunch::start('hooks.main_ready');
        $this->launch->openRuntime($this->app);
        $this->asLaunchedAgent(fn () => $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(LaunchStacks::class)->open($this->target(), ReadyStateType::MainAgent),
        ));
    }

    public function test_an_allowed_stop_answers_the_host_with_an_empty_object(): void
    {
        $this->hook('claude-code', $this->stopBody())->assertOk()->assertExactJson(['stdout' => '{}', 'stderr' => '', 'exitCode' => 0]);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_a_started_task_holds_the_stop_through_the_endpoint(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->asLaunchedAgent(fn () => $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->launch->session->id)));

        $stdout = $this->hook('claude-code', $this->stopBody())->assertOk()->json('stdout');

        $this->assertStringContainsString("Task {$task->number} still needs work", (string) $stdout);
    }

    #[TimeLimit(seconds: 5, reason: 'It runs Core\'s real admission, which classifies the line against the stored rules.')]
    public function test_cores_admission_refuses_an_unsaved_check_and_sends_a_read_to_the_runner(): void
    {
        $refused = json_decode((string) $this->hook('claude-code', $this->bashBody('composer test'), 'call-1')->assertOk()->json('stdout'), true);
        $admitted = json_decode((string) $this->hook('claude-code', $this->bashBody('git status'), 'call-2')->assertOk()->json('stdout'), true);

        $this->assertSame('deny', $refused['hookSpecificOutput']['permissionDecision']);
        $this->assertStringContainsString(AdmissionRefusal::NOTICE, $refused['hookSpecificOutput']['permissionDecisionReason']);
        $runnerLine = $admitted['hookSpecificOutput']['updatedInput']['command'];
        $this->assertStringStartsWith('journal process run --admission ', $runnerLine);
    }

    public function test_no_native_flag_makes_a_line_admitted(): void
    {
        $flagged = json_decode($this->bashBody('composer test'), true);
        $flagged['tool_input']['saved'] = true;

        $stdout = json_decode((string) $this->hook('claude-code', (string) json_encode($flagged))->assertOk()->json('stdout'), true);

        $this->assertSame('deny', $stdout['hookSpecificOutput']['permissionDecision']);
    }

    public function test_a_retry_gets_exactly_the_recorded_bytes(): void
    {
        $first = $this->hook('claude-code', $this->bashBody('composer test'), 'call-7')->assertOk()->getContent();
        $retry = $this->hook('claude-code', $this->bashBody('composer test'), 'call-7')->assertOk()->getContent();

        $this->assertSame($first, $retry);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_a_retry_with_other_input_conflicts(): void
    {
        $this->hook('claude-code', $this->bashBody('composer test'), 'call-7')->assertOk();

        $this->hook('claude-code', $this->bashBody('git status'), 'call-7')->assertStatus(409);
    }

    public function test_codex_answers_through_its_own_adapter(): void
    {
        $body = (string) json_encode(['session_id' => 'session-redacted', 'hook_event_name' => 'PreToolUse', 'tool_name' => 'Bash', 'tool_input' => ['command' => 'composer test']]);

        $stdout = json_decode((string) $this->hook('codex', $body)->assertOk()->json('stdout'), true);

        $this->assertSame('deny', $stdout['hookSpecificOutput']['permissionDecision']);
    }

    public function test_an_unauthenticated_call_is_refused(): void
    {
        $headers = $this->launch->serverHeaders($this->stopBody(), target: '/hooks/claude-code');
        unset($headers['HTTP_AUTHORIZATION']);

        $this->call('POST', '/hooks/claude-code', server: $headers, content: $this->stopBody())->assertUnauthorized();
        $this->call('POST', '/hooks/claude-code', server: $this->launch->serverHeaders('{"other":"body"}', target: '/hooks/claude-code'), content: $this->stopBody())->assertUnauthorized();
    }

    public function test_a_malformed_or_unmapped_payload_is_refused(): void
    {
        $this->hook('claude-code', '{"session_id":"session-redacted"}', 'call-1')->assertUnprocessable();
        $this->hook('claude-code', '{"session_id":"session-redacted","hook_event_name":"Notification"}', 'call-2')->assertUnprocessable();
        $this->hook('claude-code', '{"session_id":"session-redacted","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{}}', 'call-3')->assertUnprocessable();
    }

    public function test_a_clear_keeps_the_journal_session_and_records_the_new_program_session(): void
    {
        $this->hook('claude-code', '{"session_id":"program-session-1","hook_event_name":"SessionStart","source":"startup"}', 'call-1')->assertOk();
        $this->hook('claude-code', '{"session_id":"program-session-2","hook_event_name":"SessionStart","source":"clear"}', 'call-2')->assertOk();

        $this->assertSame(1, AgentSession::query()->count());
        $this->assertSame('program-session-2', $this->launch->session->fresh(['currentConversation'])?->currentConversation?->native_id);
        $this->assertSame(2, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_an_unknown_program_has_no_endpoint(): void
    {
        $this->hook('another-program', $this->stopBody())->assertNotFound();
    }

    /**
     * @return TestResponse<Response>
     */
    private function hook(string $program, string $body, string $callId = 'call-1'): TestResponse
    {
        $this->app->forgetScopedInstances();

        return $this->call('POST', "/hooks/{$program}", server: $this->launch->serverHeaders($body, $callId, target: "/hooks/{$program}"), content: $body);
    }

    private function asLaunchedAgent(\Closure $work): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(
            $this->launch->agent->id,
            $this->launch->session->id,
            'hooks.main_ready',
            new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')),
            null,
        ));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($this->launch->agent->id), new OwnerAuthority('test'));
        $work();
        $this->app->forgetScopedInstances();
    }

    private function target(): StackTarget
    {
        return new StackTarget($this->launch->agent->id, $this->launch->session->id);
    }

    private function stopBody(): string
    {
        return '{"session_id":"session-redacted","hook_event_name":"Stop","stop_hook_active":false}';
    }

    private function bashBody(string $command): string
    {
        return (string) json_encode(['session_id' => 'session-redacted', 'hook_event_name' => 'PreToolUse', 'tool_name' => 'Bash', 'tool_input' => ['command' => $command]]);
    }
}
