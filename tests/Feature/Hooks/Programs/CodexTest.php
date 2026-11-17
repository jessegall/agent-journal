<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Programs;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Exceptions\UnsupportedHook;
use App\Core\Hooks\Inputs\CommandKind;
use App\Core\Hooks\Inputs\FileEditRequested;
use App\Core\Hooks\Inputs\FileOperation;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Programs\CodexAdapter;
use App\Core\Hooks\Programs\JudgedCall;
use App\Core\Hooks\Programs\ProgramReplies;
use App\Core\Hooks\Programs\ProgramReply;
use App\Core\Hooks\Stack\AgentStack;
use App\Core\Hooks\Stack\Frame;
use App\Core\Hooks\Stack\HookAnswer;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Support\ChecksProgramFixtures;
use Tests\TestCase;

final class CodexTest extends TestCase
{
    use ChecksProgramFixtures;

    protected static function fixtureFolder(): string
    {
        return 'Codex';
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
        $this->assertSame('echo hello', $input->command->source);
        $this->assertSame([CommandKind::Ordinary], array_map(fn ($part) => $part->kind, $input->command->parts));
    }

    public function test_a_patch_names_the_file_it_updates_or_adds(): void
    {
        $update = $this->inputOf($this->adapter()->callFor($this->payload('patch updating a file'), $this->hook()));
        $add = $this->inputOf($this->adapter()->callFor($this->payload('patch adding a file'), $this->hook()));

        $this->assertInstanceOf(FileEditRequested::class, $update);
        $this->assertInstanceOf(FileEditRequested::class, $add);
        $this->assertSame(['notes.txt'], $update->changes->paths());
        $this->assertSame([FileOperation::Edit], array_map(fn ($change) => $change->operation, $update->changes->changes));
        $this->assertSame([FileOperation::Create], array_map(fn ($change) => $change->operation, $add->changes->changes));
    }

    public function test_a_stop_that_already_continued_says_so(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('stop continuing'), $this->hook()));

        $this->assertInstanceOf(StopRequested::class, $input);
        $this->assertTrue($input->stop->isContinuation);
    }

    public function test_a_journal_allow_is_neutral_and_names_no_permission(): void
    {
        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $this->render('shell command', Decision::allow())->stdout);
    }

    public function test_a_denial_carries_its_reason(): void
    {
        $reply = json_decode($this->render('shell command', Decision::deny('Save it first.'))->stdout, true);

        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertSame('Save it first.', $reply['hookSpecificOutput']['permissionDecisionReason']);
    }

    public function test_one_stop_blocker_gives_one_reason(): void
    {
        $this->assertSame('{"decision":"block","reason":"Task 42 still needs work."}', $this->render('stop', Decision::preventStop('Task 42 still needs work.'))->stdout);
    }

    public function test_a_rewrite_is_refused_with_the_journal_command_and_its_child_is_dropped(): void
    {
        $capabilities = $this->adapter()->capabilities();
        $stackBefore = new AgentStack([], new InMemoryStateFactory);
        $stackAfter = new AgentStack([new Frame('guide', new StateReference('guide', NoSubject::None), ScriptedState::delegating())], new InMemoryStateFactory);
        $rewrite = new HookAnswer(Decision::rewrite('journal run tests'), [], [], $stackAfter);

        $settled = $capabilities->rewrites->finalAnswer($rewrite, $stackBefore);
        $reply = json_decode($this->renderAnswer('shell command', $settled)->stdout, true);

        $this->assertSame([], $settled->stack->frameIds());
        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(ProgramReplies::REWRITE_REFUSAL, $reply['hookSpecificOutput']['permissionDecisionReason']);
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

    private function render(string $name, Decision $decision): ProgramReply
    {
        return $this->renderAnswer($name, new HookAnswer($decision, [], [], new AgentStack([], new InMemoryStateFactory)));
    }

    private function renderAnswer(string $name, HookAnswer $answer): ProgramReply
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
