<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks\Drivers;

use App\Enums\CommandRules\CommandType;
use App\Enums\Drivers\DriverPermission;
use App\Enums\Files\FileOperation;
use App\Exceptions\UnsupportedHook;
use App\Support\Decisions\Decision;
use App\Support\Drivers\Adapters\ClaudeCodeAdapter;
use App\Support\Drivers\Adapters\JudgedCall;
use App\Support\Drivers\Adapters\NotificationCall;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Stack\AgentStack;
use App\Support\Stack\HookAnswer;
use App\Values\StackTarget;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Support\ChecksProgramAdapter;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestText;
use Tests\TestCase;

#[TestsMachinery(ClaudeCodeAdapter::class)]
final class ClaudeCodeTest extends TestCase
{
    use ChecksProgramAdapter;
    use RefreshHookDatabase;

    private const string SHELL_LINE = 'echo hello';

    private const string PROMPT_REASON = 'Answer message 95 first.';

    private const string STOP_REASON = 'Task 42 still needs work.';

    private const string CONTEXT_LINE = 'Waiting.';

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
        $this->assertSame(self::SHELL_LINE, $input->command->source);
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

    public function test_a_journal_allow_answers_allow_so_no_user_is_asked(): void
    {
        $reply = $this->render('shell command', Decision::allow());

        $this->assertSame(
            '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}',
            $reply->stdout,
        );
    }

    public function test_a_denied_shell_command_carries_its_reason(): void
    {
        $rendered = $this->render('shell command', Decision::deny(TestText::of('Save it first.')));
        $reply = json_decode($rendered->stdout, true);

        $this->assertSame(
            [
                'hookEventName' => 'PreToolUse',
                'permissionDecision' => 'deny',
                'permissionDecisionReason' => 'Save it first.',
            ],
            $reply['hookSpecificOutput'],
        );
    }

    public function test_a_rewrite_keeps_every_other_argument_and_allows_the_rewritten_line(): void
    {
        $reply = json_decode($this->render('shell command', Decision::rewrite('journal run tests'))->stdout, true);

        $this->assertSame(
            ['command' => 'journal run tests', 'description' => 'Run echo hello'],
            $reply['hookSpecificOutput']['updatedInput'],
        );
        $this->assertSame(DriverPermission::Allow->value, $reply['hookSpecificOutput']['permissionDecision']);
    }

    public function test_a_denied_prompt_is_blocked_with_its_reason(): void
    {
        $this->assertSame(
            json_encode(['decision' => 'block', 'reason' => self::PROMPT_REASON]),
            $this->render('prompt', Decision::deny(TestText::of(self::PROMPT_REASON)))->stdout,
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
            json_encode(['decision' => 'block', 'reason' => self::STOP_REASON]),
            $this->render('stop', Decision::deny(TestText::of(self::STOP_REASON)))->stdout,
        );
        $this->assertSame('{}', $this->render('stop', Decision::allow())->stdout);
    }

    public function test_a_refusal_shows_each_context_line_once_and_never_repeats_its_reason(): void
    {
        $context = [self::STOP_REASON, self::CONTEXT_LINE, self::CONTEXT_LINE];

        $this->assertSame(
            json_encode(['decision' => 'block', 'reason' => self::STOP_REASON."\n".self::CONTEXT_LINE]),
            $this->render('stop', Decision::deny(TestText::of(self::STOP_REASON)), $context)->stdout,
        );
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

        return ($call->render)(
            new HookAnswer($decision, $context, [], new AgentStack([], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1'))),
            TestText::renderer(),
        );
    }

    private function adapter(): ClaudeCodeAdapter
    {
        return $this->app->make(ClaudeCodeAdapter::class);
    }
}
