<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Drivers;

use App\Enums\CommandType;
use App\Enums\FileOperation;
use App\Enums\NoSubject;
use App\Exceptions\UnsupportedHook;
use App\Support\Decisions\Decision;
use App\Support\Drivers\Adapters\CodexAdapter;
use App\Support\Drivers\Adapters\JudgedCall;
use App\Support\Drivers\DriverReplies;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\References\StateReference;
use App\Support\Stack\AgentStack;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\HookAnswer;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Support\ChecksProgramAdapter;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class CodexTest extends TestCase
{
    use ChecksProgramAdapter;
    use RefreshHookDatabase;

    private const string SHELL_LINE = 'echo hello';

    private const string DENIAL_REASON = 'Save it first.';

    private const string STOP_REASON = 'Task 42 still needs work.';

    protected static function fixtureFolder(): string
    {
        return 'Codex';
    }

    protected static function selectedModel(): string
    {
        return 'gpt-5-codex';
    }

    #[DataProvider('mapping')]
    public function test_each_captured_callback_maps_as_the_capability_record_says(string $name, string $expected): void
    {
        if ($expected === 'unsupported') {
            $this->expectException(UnsupportedHook::class);
        }

        $input = $this->inputOf($this->adapter()->callFor($this->payload($name), $this->hook()));

        $this->assertSame($expected, $input->methodName());
        $this->assertTrue($this->adapter()->capabilities()->supports($expected));
    }

    public function test_the_bash_tool_is_read_as_a_shell_command(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('shell command'), $this->hook()));

        $this->assertInstanceOf(ShellCommandRequested::class, $input);
        $this->assertSame(self::SHELL_LINE, $input->command->source);
        $this->assertSame([CommandType::Ordinary], array_map(fn ($part) => $part->type, $input->command->parts));
    }

    public function test_a_patch_names_the_file_it_updates_or_adds(): void
    {
        $update = $this->inputOf($this->adapter()->callFor($this->payload('patch updating a file'), $this->hook()));
        $add = $this->inputOf($this->adapter()->callFor($this->payload('patch adding a file'), $this->hook()));

        $this->assertInstanceOf(FileEditRequested::class, $update);
        $this->assertInstanceOf(FileEditRequested::class, $add);
        $this->assertSame(['notes.txt'], $update->changes->paths());
        $this->assertSame(
            [FileOperation::Edit],
            array_map(fn ($change) => $change->operation, $update->changes->changes),
        );
        $this->assertSame(
            [FileOperation::Create],
            array_map(fn ($change) => $change->operation, $add->changes->changes),
        );
    }

    public function test_a_stop_that_already_continued_says_so(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('stop continuing'), $this->hook()));

        $this->assertInstanceOf(StopRequested::class, $input);
        $this->assertTrue($input->stop->isContinuation);
    }

    public function test_a_journal_allow_answers_allow_so_no_approval_is_asked(): void
    {
        $this->assertSame(
            '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}',
            $this->render('shell command', Decision::allow())->stdout,
        );
    }

    public function test_a_denial_carries_its_reason(): void
    {
        $reply = json_decode($this->render('shell command', Decision::deny(self::DENIAL_REASON))->stdout, true);

        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(self::DENIAL_REASON, $reply['hookSpecificOutput']['permissionDecisionReason']);
    }

    public function test_one_stop_blocker_gives_one_reason(): void
    {
        $this->assertSame(
            json_encode(['decision' => 'block', 'reason' => self::STOP_REASON]),
            $this->render('stop', Decision::deny(self::STOP_REASON))->stdout,
        );
    }

    public function test_a_rewrite_is_refused_with_the_journal_command_and_its_child_is_dropped(): void
    {
        $capabilities = $this->adapter()->capabilities();
        $stackBefore = new AgentStack([], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1'));
        $stackAfter = new AgentStack(
            [
                new Frame(
                    'guide',
                    new StateReference('guide', NoSubject::None),
                    ScriptedState::passing(),
                    CarbonImmutable::now(),
                ),
            ],
            new InMemoryStateFactory(),
            new StackTarget('agent-1', 'session-1'),
        );
        $rewrite = new HookAnswer(Decision::rewrite('journal run tests'), [], [], $stackAfter);

        $settled = $capabilities->finalAnswer($rewrite, $stackBefore);
        $reply = json_decode($this->renderAnswer('shell command', $settled)->stdout, true);

        $this->assertSame([], $settled->stack->frameIds());
        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(DriverReplies::REWRITE_REFUSAL, $reply['hookSpecificOutput']['permissionDecisionReason']);
        $this->assertArrayNotHasKey('updatedInput', $reply['hookSpecificOutput']);
    }

    public function test_a_rewrite_reaching_the_renderer_is_refused_too(): void
    {
        $reply = json_decode($this->render('shell command', Decision::rewrite('journal run tests'))->stdout, true);

        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertArrayNotHasKey('updatedInput', $reply['hookSpecificOutput']);
    }

    public function test_the_inputs_codex_has_no_callback_for_are_left_unmapped(): void
    {
        foreach (self::programFixture()->unmappedInputs() as $method) {
            $this->assertFalse($this->adapter()->capabilities()->supports($method));
        }
    }

    private function render(string $name, Decision $decision): DriverReply
    {
        return $this->renderAnswer(
            $name,
            new HookAnswer($decision, [], [], new AgentStack([], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1'))),
        );
    }

    private function renderAnswer(string $name, HookAnswer $answer): DriverReply
    {
        $call = $this->adapter()->callFor($this->payload($name), $this->hook());
        $this->assertInstanceOf(JudgedCall::class, $call);

        return ($call->render)($answer);
    }

    private function adapter(): CodexAdapter
    {
        return $this->app->make(CodexAdapter::class);
    }
}
