<?php

declare(strict_types=1);

namespace Tests\Hooks;

use App\Agents\Drivers\DefaultDrivers;
use App\Enums\Hooks\HookEvent;
use App\Models\Drivers\HookCall;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsHook;
use Tests\Support\Hooks\SendsSignedHooks;
use Tests\TestCase;

/**
 * Every moment Codex's hooks reach the journal, sent as Codex sends it to POST hooks.answer, signed as a started agent
 * whose stack holds only its ready state: each is answered with a reply Codex reads and recorded for the session. A
 * failure notification, which Codex never sends, is refused, and so is a call to one of Codex's own subagent tools.
 */
#[TestsHook(DefaultDrivers::CODEX, HookEvent::SessionStart)]
#[TestsHook(DefaultDrivers::CODEX, HookEvent::UserPromptSubmit)]
#[TestsHook(DefaultDrivers::CODEX, HookEvent::PreToolUse)]
#[TestsHook(DefaultDrivers::CODEX, HookEvent::PostToolUse)]
#[TestsHook(DefaultDrivers::CODEX, HookEvent::Stop)]
#[TestsHook(DefaultDrivers::CODEX, HookEvent::SessionEnd)]
final class CodexHooksTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedHooks;

    /**
     * The tables these tests commit to, the runtime its start opens included, emptied around each test.
     */
    private const array TABLES = [
        'agents',
        'agent_sessions',
        'agent_runtimes',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'driver_conversations',
        'conversation_visits',
        'process_events',
        'part_runs',
        'process_runs',
        'command_requests',
    ];

    /**
     * The text every refusal of a program's own subagents names.
     */
    private const string OWN_SUBAGENTS_RULE = 'rule 36';

    protected function setUp(): void
    {
        parent::setUp();

        $this->signReadyAgent();
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function moments(): iterable
    {
        yield 'session start' => [
            '{"session_id":"driver-session-1","hook_event_name":"SessionStart","source":"startup"}',
        ];

        yield 'prompt' => ['{"session_id":"driver-session-1","hook_event_name":"UserPromptSubmit","prompt":"Go on."}'];

        yield 'tool call' => [
            '{"session_id":"driver-session-1","hook_event_name":"PreToolUse","tool_name":"Bash",'
                .'"tool_input":{"command":"git status"}}',
        ];

        yield 'finished tool' => [
            '{"session_id":"driver-session-1","hook_event_name":"PostToolUse","tool_name":"Bash",'
                .'"tool_input":{"command":"git status"},"tool_response":"Exit code: 0\nclean"}',
        ];

        yield 'stop' => ['{"session_id":"driver-session-1","hook_event_name":"Stop","stop_hook_active":false}'];

        yield 'session end' => ['{"session_id":"driver-session-1","hook_event_name":"SessionEnd","reason":"other"}'];
    }

    #[DataProvider('moments')]
    public function test_each_moment_is_answered_with_a_reply_codex_reads_and_recorded(string $body): void
    {
        $reply = $this->hook(DefaultDrivers::CODEX, $body)->assertOk();

        $this->assertSame(0, $reply->json('exitCode'));
        $this->assertIsArray(json_decode((string) $reply->json('stdout'), true));
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_a_failure_notification_codex_never_sends_is_refused(): void
    {
        $body = '{"session_id":"driver-session-1","hook_event_name":"StopFailure","error":"authentication_failed"}';

        $this->hook(DefaultDrivers::CODEX, $body)->assertUnprocessable();
    }

    public function test_a_write_answers_through_codexs_own_adapter(): void
    {
        $body = (string) json_encode([
            'session_id' => 'session-redacted',
            'hook_event_name' => 'PreToolUse',
            'tool_name' => 'Bash',
            'tool_input' => ['command' => 'composer test'],
        ]);

        $stdout = $this->hookOutput(DefaultDrivers::CODEX, $body);

        $this->assertSame('deny', $stdout['hookSpecificOutput']['permissionDecision']);
    }

    public function test_a_call_to_one_of_codexs_own_subagent_tools_is_refused_before_the_stack(): void
    {
        $body = (string) json_encode([
            'session_id' => 'session-redacted',
            'hook_event_name' => 'PreToolUse',
            'tool_name' => 'collaboration.spawn_agent',
            'tool_input' => [],
        ]);

        $reply = $this->hook(DefaultDrivers::CODEX, $body)->assertOk();

        $this->assertStringContainsString(self::OWN_SUBAGENTS_RULE, $reply->json('stdout'));
        $this->assertSame(0, HookCall::query()->authorizedFor($this->target())->count());
    }
}
