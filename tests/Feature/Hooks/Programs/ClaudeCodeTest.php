<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Programs;

use App\Agents\Values\StackTarget;
use App\Hooks\Decisions\Decision;
use App\Hooks\Drivers\ClaudeCodeAdapter;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Drivers\JudgedCall;
use App\Hooks\Drivers\NotificationCall;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\HookAnswer;
use App\Processes\Enums\CommandType;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Support\ChecksProgramAdapter;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class ClaudeCodeTest extends TestCase
{
    use ChecksProgramAdapter;
    use RefreshHookDatabase;

    protected static function fixtureFolder(): string
    {
        return 'ClaudeCode';
    }

    protected static function selectedModel(): string
    {
        return 'claude-opus-5-5';
    }

    #[DataProvider('mapping')]
    public function test_each_captured_callback_maps_as_the_capability_record_says(string $name, string $expected): void
    {
        $payload = $this->payload($name);

        if ($expected === 'unsupported') {
            $this->expectException(UnsupportedHook::class);
        }

        $call = $this->adapter()->callFor($payload, $this->hook());

        if ($expected === 'reported') {
            $this->assertInstanceOf(NotificationCall::class, $call);
            $reply = $call->replyWith(fn () => $this->fail('A notification went to the journal.'));
            $this->assertSame('{}', $reply->stdout);

            return;
        }

        if ($expected === 'untouched') {
            $this->assertSame(
                '{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}',
                $call->replyWith(fn () => $this->fail('A read went to the journal.'))->stdout,
            );

            return;
        }

        $this->assertSame($expected, $this->inputOf($call)->methodName());
        $this->assertTrue($this->adapter()->capabilities()->supports($expected));
    }

    public function test_the_shell_command_is_read_by_the_processes_parser(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('shell command'), $this->hook()));

        $this->assertInstanceOf(ShellCommandRequested::class, $input);
        $this->assertSame('echo hello', $input->command->source);
        $this->assertSame(CommandType::Ordinary, $input->command->parts[0]->type);
    }

    public function test_edits_and_writes_name_their_path_and_operation(): void
    {
        $edit = $this->inputOf($this->adapter()->callFor($this->payload('file edit'), $this->hook()));
        $write = $this->inputOf($this->adapter()->callFor($this->payload('file write'), $this->hook()));

        $this->assertInstanceOf(FileEditRequested::class, $edit);
        $this->assertInstanceOf(FileEditRequested::class, $write);
        $this->assertSame(['/redacted/notes.txt'], $edit->changes->paths());
        $this->assertSame(FileOperation::Write, $write->changes->changes[0]->operation);
    }

    public function test_a_start_after_compaction_is_the_compaction_under_the_callback_id(): void
    {
        $input = $this->inputOf(
            $this->adapter()->callFor($this->payload('session resume after compaction'), $this->hook()),
        );

        $this->assertInstanceOf(ContextCompacted::class, $input);
        $this->assertSame('call-1', $input->compactionId());
    }

    public function test_a_journal_allow_keeps_the_native_permission_prompt(): void
    {
        $reply = $this->render('shell command', Decision::allow());

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $reply->stdout);
    }

    public function test_a_denied_shell_command_carries_its_reason(): void
    {
        $reply = json_decode($this->render('shell command', Decision::deny('Save it first.'))->stdout, true);

        $this->assertSame(
            [
                'hookEventName' => 'PreToolUse',
                'permissionDecision' => 'deny',
                'permissionDecisionReason' => 'Save it first.',
            ],
            $reply['hookSpecificOutput'],
        );
    }

    public function test_a_rewrite_keeps_every_other_argument_and_grants_nothing(): void
    {
        $reply = json_decode($this->render('shell command', Decision::rewrite('journal run tests'))->stdout, true);

        $this->assertSame(
            ['command' => 'journal run tests', 'description' => 'Run echo hello'],
            $reply['hookSpecificOutput']['updatedInput'],
        );
        $this->assertArrayNotHasKey('permissionDecision', $reply['hookSpecificOutput']);
    }

    public function test_a_denied_prompt_is_blocked_with_its_reason(): void
    {
        $this->assertSame(
            '{"decision":"block","reason":"Answer message 95 first."}',
            $this->render('prompt', Decision::deny('Answer message 95 first.'))->stdout,
        );
    }

    public function test_context_reaches_the_agent_on_a_session_start_and_nothing_extra_on_an_end(): void
    {
        $start = json_decode(
            $this->render('session start', Decision::allow(), ['Message 95 waits for your answer.'])->stdout,
            true,
        );

        $this->assertSame(
            ['hookEventName' => 'SessionStart', 'additionalContext' => 'Message 95 waits for your answer.'],
            $start['hookSpecificOutput'],
        );
        $this->assertSame('{}', $this->render('session end', Decision::allow())->stdout);
    }

    public function test_a_held_stop_blocks_and_an_allowed_stop_is_empty(): void
    {
        $this->assertSame(
            '{"decision":"block","reason":"Task 42 still needs work."}',
            $this->render('stop', Decision::deny('Task 42 still needs work.'))->stdout,
        );
        $this->assertSame('{}', $this->render('stop', Decision::allow())->stdout);
    }

    public function test_every_core_input_is_mapped_except_the_ones_the_record_lists(): void
    {
        $unmapped = array_values(array_filter(
            [
                'onSessionStart',
                'onPrompt',
                'onShellCommand',
                'onFileEdit',
                'onToolRequested',
                'onStop',
                'onCompaction',
                'onToolFinished',
                'onSessionEnd',
            ],
            fn (string $method) => ! $this->adapter()->capabilities()->supports($method),
        ));

        $this->assertSame(self::programFixture()->unmappedInputs(), $unmapped);
    }

    /**
     * @param  list<string>  $context
     */
    private function render(string $name, Decision $decision, array $context = []): DriverReply
    {
        $call = $this->adapter()->callFor($this->payload($name), $this->hook());
        $this->assertInstanceOf(JudgedCall::class, $call);

        return ($call->render)(new HookAnswer($decision, $context, [], new AgentStack([], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1'))));
    }

    private function adapter(): ClaudeCodeAdapter
    {
        return $this->app->make(ClaudeCodeAdapter::class);
    }
}
