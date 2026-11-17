<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Domain\Agents\AgentContext;
use App\Domain\Agents\SignedCall;
use App\Domain\Hooks\Inputs\CommandEffect;
use App\Domain\Hooks\Inputs\CommandKind;
use App\Domain\Hooks\Inputs\CommandPart;
use App\Domain\Hooks\Inputs\MissingCommandFacts;
use App\Domain\Hooks\Inputs\ParseOutcome;
use App\Domain\Hooks\Inputs\ShellCommand;
use App\Domain\Hooks\Inputs\ShellCommandParser;
use App\Domain\Hooks\Inputs\ShellDialect;
use App\Domain\Hooks\LaunchStacks;
use App\Domain\Hooks\Models\HookCall;
use App\Domain\Hooks\StackTransaction;
use App\Domain\Hooks\States\ReadyStateType;
use App\Domain\Hooks\Storage\StackTarget;
use App\Domain\Tasks\Models\Task;
use App\Domain\Tasks\StartTask;
use Carbon\CarbonImmutable;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class HookEndpointTest extends TestCase
{
    use RefreshHookDatabase;

    private const TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'tasks'];

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->emptyTables();
        $this->launch = TestLaunch::start('hooks.main_ready');
        $this->asLaunchedAgent(fn () => $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(LaunchStacks::class)->open($this->target(), ReadyStateType::MainAgent),
        ));
    }

    protected function tearDown(): void
    {
        $this->emptyTables();

        parent::tearDown();
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
                return new ShellCommand($line, $dialect, ParseOutcome::Complete, [new CommandPart('composer', ['test'], CommandEffect::ReadsOnly, CommandKind::SavedCommand)]);
            }
        });
        $flagged = json_decode($this->bashBody('composer test'), true);
        $flagged['tool_input']['saved'] = true;

        $stdout = $this->hook('claude-code', (string) json_encode($flagged))->assertOk()->json('stdout');

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $stdout);
    }

    public function test_without_a_parser_a_shell_call_is_refused_and_nothing_is_recorded(): void
    {
        $this->app->instance(ShellCommandParser::class, new MissingCommandFacts);

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
        $body = (string) json_encode(['session_id' => 'session-redacted', 'hook_event_name' => 'PreToolUse', 'tool_name' => 'shell', 'tool_input' => ['command' => ['bash', '-lc', 'composer test']]]);

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

    public function test_an_unknown_program_has_no_endpoint(): void
    {
        $this->hook('another-program', $this->stopBody())->assertNotFound();
    }

    /**
     * @return array<int, string>
     */
    protected function connectionsToTransact(): array
    {
        return [];
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

    private function emptyTables(): void
    {
        foreach (self::TABLES as $table) {
            DB::table($table)->truncate();
        }
    }
}
