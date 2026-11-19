<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Actions\StartStacks;
use App\Hooks\Models\HookCall;
use App\Hooks\Support\StackTransaction;
use App\Processes\Values\AdmissionRefusal;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Models\Task;
use Illuminate\Http\Response;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

final class HookEndpointTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The tables these tests commit to, the runtime its start opens included, emptied around each test.
     */
    private const array TABLES = [
        'agents',
        'agent_sessions',
        'agent_runtimes',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'tasks',
        'links',
        'program_conversations',
        'conversation_visits',
        'process_events',
        'part_runs',
        'process_runs',
        'command_requests',
    ];

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        config(['processes.runner' => true]);
        $this->start = TestStart::start('main-agent');
        $this->start->openRuntime($this->app);
        $this->asStartedAgent(fn () => $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(StartStacks::class)->open($this->target()),
        ));
    }

    public function test_an_allowed_stop_answers_the_host_with_an_empty_object(): void
    {
        $this->hook('claude-code', $this->stopBody())
            ->assertOk()
            ->assertExactJson(['stdout' => '{}', 'stderr' => '', 'exitCode' => 0]);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_a_started_task_holds_the_stop_through_the_endpoint(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->asStartedAgent(fn () => $this->app->make(CommandBus::class)->run(new StartTask($task->id)));

        $stdout = $this->hook('claude-code', $this->stopBody())->assertOk()->json('stdout');

        $this->assertStringContainsString("Task {$task->number} still needs work", (string) $stdout);
    }

    #[TimeLimit(
        seconds: 5,
        reason: 'It runs Core\'s real admission, which classifies the line against the stored rules.',
    )]
    public function test_cores_admission_refuses_an_unsaved_check_and_sends_a_read_to_the_runner(): void
    {
        $refused = $this->hookOutput('claude-code', $this->bashBody('composer test'), 'call-1');
        $admitted = $this->hookOutput('claude-code', $this->bashBody('git status'), 'call-2');

        $this->assertSame('deny', $refused['hookSpecificOutput']['permissionDecision']);
        $this->assertStringContainsString(
            AdmissionRefusal::NOTICE,
            $refused['hookSpecificOutput']['permissionDecisionReason'],
        );
        $runnerLine = $admitted['hookSpecificOutput']['updatedInput']['command'];
        $this->assertStringStartsWith('journal process run --admission ', $runnerLine);
    }

    public function test_no_native_flag_makes_a_line_admitted(): void
    {
        $flagged = json_decode($this->bashBody('composer test'), true);
        $flagged['tool_input']['saved'] = true;

        $stdout = $this->hookOutput('claude-code', (string) json_encode($flagged));

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
        $body = $this->bashBody('composer test');

        $stdout = json_decode((string) $this->hook('codex', $body)->assertOk()->json('stdout'), true);

        $this->assertSame('deny', $stdout['hookSpecificOutput']['permissionDecision']);
    }

    public function test_an_unauthenticated_call_is_refused(): void
    {
        $headers = $this->start->serverHeaders($this->stopBody(), target: '/hooks/claude-code');
        unset($headers['HTTP_AUTHORIZATION']);

        $this->call('POST', '/hooks/claude-code', server: $headers, content: $this->stopBody())->assertUnauthorized();
        $headers = $this->start->serverHeaders('{"other":"body"}', target: '/hooks/claude-code');
        $this->call('POST', '/hooks/claude-code', server: $headers, content: $this->stopBody())->assertUnauthorized();
    }

    public function test_a_malformed_or_unmapped_payload_is_refused(): void
    {
        $this->hook('claude-code', '{"session_id":"session-redacted"}', 'call-1')->assertUnprocessable();
        $notification = '{"session_id":"session-redacted","hook_event_name":"Notification"}';
        $noCommand = '{"session_id":"session-redacted","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{}}';
        $this->hook('claude-code', $notification, 'call-2')->assertUnprocessable();
        $this->hook('claude-code', $noCommand, 'call-3')->assertUnprocessable();
    }

    public function test_a_clear_keeps_the_journal_session_and_records_the_new_program_session(): void
    {
        $startup = '{"session_id":"program-session-1","hook_event_name":"SessionStart","source":"startup"}';
        $clear = '{"session_id":"program-session-2","hook_event_name":"SessionStart","source":"clear"}';
        $this->hook('claude-code', $startup, 'call-1')->assertOk();
        $this->hook('claude-code', $clear, 'call-2')->assertOk();

        $this->assertSame(1, AgentSession::query()->count());
        $conversation = $this->start->session->fresh(['currentConversation'])?->currentConversation;
        $this->assertSame('program-session-2', $conversation?->native_id);
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

        $headers = $this->start->serverHeaders($body, $callId, target: "/hooks/{$program}");

        return $this->call('POST', "/hooks/{$program}", server: $headers, content: $body);
    }

    /**
     * The hook's answer to the program, decoded from the stdout it returned.
     *
     * @return array<string, mixed>
     */
    private function hookOutput(string $program, string $body, string $callId = 'call-1'): array
    {
        return (array) json_decode((string) $this->hook($program, $body, $callId)->assertOk()->json('stdout'), true);
    }

    private function asStartedAgent(\Closure $work): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(
            $this->start->agent->id,
            $this->start->session->id,
            new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')),
            null,
        ));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->start->agent->id),
            TestStartAuthority::forAgent($this->start->agent->id),
        );
        $work();
        $this->app->forgetScopedInstances();
    }

    private function target(): StackTarget
    {
        return new StackTarget($this->start->agent->id, $this->start->session->id);
    }

    private function stopBody(): string
    {
        return '{"session_id":"session-redacted","hook_event_name":"Stop","stop_hook_active":false}';
    }

    private function bashBody(string $command): string
    {
        return (string) json_encode([
            'session_id' => 'session-redacted',
            'hook_event_name' => 'PreToolUse',
            'tool_name' => 'Bash',
            'tool_input' => ['command' => $command],
        ]);
    }
}
