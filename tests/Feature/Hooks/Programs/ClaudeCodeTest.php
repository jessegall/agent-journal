<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Programs;

use App\Domain\Hooks\Decisions\Decision;
use App\Domain\Hooks\Inputs\CommandKind;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\FileOperation;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\Inputs\SessionStarted;
use App\Domain\Hooks\Inputs\SessionStartSource;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Programs\ClaudeCodeAdapter;
use App\Domain\Hooks\Programs\HookPayload;
use App\Domain\Hooks\Programs\JournalCall;
use App\Domain\Hooks\Programs\NativeCall;
use App\Domain\Hooks\Programs\ProgramReply;
use App\Domain\Hooks\Programs\UnsupportedHook;
use App\Domain\Hooks\Stack\AgentStack;
use App\Domain\Hooks\Stack\HookAnswer;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\TestCase;

final class ClaudeCodeTest extends TestCase
{
    /**
     * @return iterable<string, array{string, string}>
     */
    public static function mapping(): iterable
    {
        foreach (self::fixture('capabilities.json')['mapping'] as $name => $expected) {
            yield $name => [$name, $expected];
        }
    }

    #[DataProvider('mapping')]
    public function test_each_captured_callback_maps_as_the_capability_record_says(string $name, string $expected): void
    {
        $payload = $this->payload($name);

        if ($expected === 'unsupported') {
            $this->expectException(UnsupportedHook::class);
        }

        $call = $this->adapter()->callFor($payload, $this->hook());

        if ($expected === 'untouched') {
            $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $call->replyWith(fn () => $this->fail('A read went to the journal.'))->stdout);

            return;
        }

        $this->assertSame($expected, $this->inputOf($call)->methodName());
        $this->assertTrue($this->adapter()->capabilities()->supports($expected));
    }

    public function test_the_shell_command_is_read_by_the_processes_parser(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('shell command'), $this->hook()));

        $this->assertInstanceOf(ShellCommandRequested::class, $input);
        $this->assertSame('composer test', $input->command->source);
        $this->assertSame(CommandKind::TestRun, $input->command->parts[0]->kind);
    }

    public function test_edits_and_writes_name_their_path_and_operation(): void
    {
        $edit = $this->inputOf($this->adapter()->callFor($this->payload('file edit'), $this->hook()));
        $write = $this->inputOf($this->adapter()->callFor($this->payload('file write'), $this->hook()));

        $this->assertInstanceOf(FileEditRequested::class, $edit);
        $this->assertInstanceOf(FileEditRequested::class, $write);
        $this->assertSame(['/redacted/app/Domain/Domain.php'], $edit->changes->paths());
        $this->assertSame(FileOperation::Create, $write->changes->changes[0]->operation);
    }

    public function test_a_start_after_compaction_keeps_its_source(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('session resume after compaction'), $this->hook()));

        $this->assertInstanceOf(SessionStarted::class, $input);
        $this->assertSame(SessionStartSource::Compact, $input->start->source);
    }

    public function test_a_journal_allow_keeps_the_native_permission_prompt(): void
    {
        $reply = $this->render('shell command', Decision::allow());

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $reply->stdout);
    }

    public function test_a_denied_shell_command_carries_its_reason(): void
    {
        $reply = json_decode($this->render('shell command', Decision::deny('Save it first.'))->stdout, true);

        $this->assertSame(['hookEventName' => 'PreToolUse', 'permissionDecision' => 'deny', 'permissionDecisionReason' => 'Save it first.'], $reply['hookSpecificOutput']);
    }

    public function test_a_rewrite_keeps_every_other_argument_and_grants_nothing(): void
    {
        $reply = json_decode($this->render('shell command', Decision::rewrite('journal run tests'))->stdout, true);

        $this->assertSame(['command' => 'journal run tests', 'description' => 'Run the tests', 'timeout' => 120000], $reply['hookSpecificOutput']['updatedInput']);
        $this->assertArrayNotHasKey('permissionDecision', $reply['hookSpecificOutput']);
    }

    public function test_a_denied_prompt_is_blocked_with_its_reason(): void
    {
        $this->assertSame('{"decision":"block","reason":"Answer message 95 first."}', $this->render('prompt', Decision::deny('Answer message 95 first.'))->stdout);
    }

    public function test_context_reaches_the_agent_on_a_session_start_and_nothing_extra_on_an_end(): void
    {
        $start = json_decode($this->render('session start', Decision::allow(), ['Message 95 waits for your answer.'])->stdout, true);

        $this->assertSame(['hookEventName' => 'SessionStart', 'additionalContext' => 'Message 95 waits for your answer.'], $start['hookSpecificOutput']);
        $this->assertSame('{}', $this->render('session end', Decision::allow())->stdout);
    }

    public function test_a_held_stop_blocks_and_an_allowed_stop_is_empty(): void
    {
        $this->assertSame('{"decision":"block","reason":"Task 42 still needs work."}', $this->render('stop', Decision::preventStop('Task 42 still needs work.'))->stdout);
        $this->assertSame('{}', $this->render('stop', Decision::allow())->stdout);
    }

    public function test_the_compaction_input_is_left_to_its_own_task(): void
    {
        foreach (self::fixture('capabilities.json')['unmapped inputs'] as $method) {
            $this->assertFalse($this->adapter()->capabilities()->supports($method));
        }
    }

    /**
     * @param  list<string>  $context
     */
    private function render(string $name, Decision $decision, array $context = []): ProgramReply
    {
        $call = $this->adapter()->callFor($this->payload($name), $this->hook());
        $this->assertInstanceOf(JournalCall::class, $call);

        return ($call->render)(new HookAnswer($decision, $context, [], new AgentStack([], new InMemoryStateFactory)));
    }

    private function inputOf(NativeCall $call): HookInput
    {
        $this->assertInstanceOf(JournalCall::class, $call);

        return $call->input;
    }

    private function adapter(): ClaudeCodeAdapter
    {
        return $this->app->make(ClaudeCodeAdapter::class);
    }

    private function payload(string $name): HookPayload
    {
        return HookPayload::from(self::fixture('hooks.json')['payloads'][$name]);
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity(1, 10, 'call-1', hash('sha256', 'the input'));
    }

    /**
     * @return array<string, mixed>
     */
    private static function fixture(string $file): array
    {
        return json_decode((string) file_get_contents(dirname(__DIR__, 3).'/Fixtures/Hooks/ClaudeCode/'.$file), true, flags: JSON_THROW_ON_ERROR);
    }
}
