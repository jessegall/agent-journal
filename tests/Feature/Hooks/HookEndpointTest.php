<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Agents\Models\AgentSession;
use App\Core\Agents\Support\AgentContext;
use App\Core\AgentRequests\Support\SignedCall;
use App\Core\Hooks\Actions\LaunchStacks;
use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Enums\CommandEffect;
use App\Core\Hooks\Enums\CommandKind;
use App\Core\Hooks\Enums\ParseOutcome;
use App\Core\Hooks\Enums\ReadyStateType;
use App\Core\Hooks\Enums\ShellDialect;
use App\Core\Hooks\Inputs\CommandPart;
use App\Core\Hooks\Inputs\MissingShellParser;
use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Models\HookCall;
use App\Core\Agents\Support\StackTarget;
use App\Core\Hooks\Support\StackTransaction;
use App\Domain\Tasks\Actions\StartTask;
use App\Domain\Tasks\Models\Task;
use Carbon\CarbonImmutable;
use Illuminate\Http\Response;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

final class HookEndpointTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'tasks', 'links'];

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->launch = TestLaunch::start('hooks.main_ready');
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
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->asLaunchedAgent(fn () => $this->app->make(StartTask::class)->start($task, $this->target()));

        $stdout = $this->hook('claude-code', $this->stopBody())->assertOk()->json('stdout');

        $this->assertStringContainsString("Task {$task->id} still needs work", (string) $stdout);
    }

    public function test_the_parsed_facts_refuse_an_unsaved_test_run_and_admit_a_read(): void
    {
        $refused = json_decode((string) $this->hook('claude-code', $this->bashBody('composer test'), 'call-1')->assertOk()->json('stdout'), true);
        $admitted = $this->hook('claude-code', $this->bashBody('git status'), 'call-2')->assertOk()->json('stdout');

        $this->assertSame('deny', $refused['hookSpecificOutput']['permissionDecision']);
        $this->assertStringContainsString('journal run', $refused['hookSpecificOutput']['permissionDecisionReason']);
        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $admitted);
    }

    public function test_the_registered_parser_decides_and_no_native_flag_can(): void
    {
        $this->app->instance(ShellCommandParser::class, new class implements ShellCommandParser
        {
            public function parse(string $line, ShellDialect $dialect): ShellCommand
            {
                return new ShellCommand($line, $dialect, ParseOutcome::Complete, [new CommandPart('composer', ['test'], CommandEffect::ReadsOnly, CommandKind::Alias)]);
            }
        });
        $flagged = json_decode($this->bashBody('composer test'), true);
        $flagged['tool_input']['saved'] = true;

        $stdout = $this->hook('claude-code', (string) json_encode($flagged))->assertOk()->json('stdout');

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $stdout);
    }

    public function test_without_a_parser_a_shell_call_is_refused_and_nothing_is_recorded(): void
    {
        $this->app->instance(ShellCommandParser::class, new MissingShellParser);

        $this->hook('claude-code', $this->bashBody('git status'))->assertStatus(503);

        $this->assertSame(0, HookCall::query()->authorizedFor($this->target())->count());
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
        $headers = $this->launch->serverHeaders($this->stopBody());
        unset($headers['HTTP_AUTHORIZATION']);

        $this->call('POST', '/hooks/claude-code', server: $headers, content: $this->stopBody())->assertUnauthorized();
        $this->call('POST', '/hooks/claude-code', server: $this->launch->serverHeaders('{"other":"body"}'), content: $this->stopBody())->assertUnauthorized();
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
        $this->assertSame('program-session-2', $this->launch->session->fresh()?->program_session_id);
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

        return $this->call('POST', "/hooks/{$program}", server: $this->launch->serverHeaders($body, $callId), content: $body);
    }

    private function asLaunchedAgent(\Closure $work): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(
            $this->launch->agent->id,
            $this->launch->session->id,
            'hooks.main_ready',
            new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')),
        ));
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
