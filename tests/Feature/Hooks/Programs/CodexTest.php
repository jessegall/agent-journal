<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Programs;

use App\Domain\Hooks\Decisions\Decision;
use App\Domain\Hooks\Decisions\NoSubject;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Inputs\CommandKind;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\FileOperation;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\Programs\CodexAdapter;
use App\Domain\Hooks\Programs\HookPayload;
use App\Domain\Hooks\Programs\JournalCall;
use App\Domain\Hooks\Programs\NativeCall;
use App\Domain\Hooks\Programs\ProgramReplies;
use App\Domain\Hooks\Programs\ProgramReply;
use App\Domain\Hooks\Programs\UnsupportedHook;
use App\Domain\Hooks\Stack\AgentStack;
use App\Domain\Hooks\Stack\Frame;
use App\Domain\Hooks\Stack\HookAnswer;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\TestCase;

final class CodexTest extends TestCase
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
        if ($expected === 'unsupported') {
            $this->expectException(UnsupportedHook::class);
        }

        $input = $this->inputOf($this->adapter()->callFor($this->payload($name), $this->hook()));

        $this->assertSame($expected, $input->methodName());
        $this->assertTrue($this->adapter()->capabilities()->supports($expected));
    }

    public function test_a_shell_command_given_as_an_argument_list_is_read_as_its_line(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('shell command as a list'), $this->hook()));

        $this->assertInstanceOf(ShellCommandRequested::class, $input);
        $this->assertSame('git status && composer test', $input->command->source);
        $this->assertSame([CommandKind::Ordinary, CommandKind::TestRun], array_map(fn ($part) => $part->kind, $input->command->parts));
    }

    public function test_a_patch_names_every_file_it_changes(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('patch over two files'), $this->hook()));

        $this->assertInstanceOf(FileEditRequested::class, $input);
        $this->assertSame(['app/Domain/Domain.php', 'docs/notes.md'], $input->changes->paths());
        $this->assertSame([FileOperation::Edit, FileOperation::Create], array_map(fn ($change) => $change->operation, $input->changes->changes));
    }

    public function test_a_stop_that_already_continued_says_so(): void
    {
        $input = $this->inputOf($this->adapter()->callFor($this->payload('stop continuing'), $this->hook()));

        $this->assertInstanceOf(StopRequested::class, $input);
        $this->assertTrue($input->stop->isContinuation);
    }

    public function test_a_journal_allow_is_neutral_and_names_no_permission(): void
    {
        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $this->render('shell command as text', Decision::allow())->stdout);
    }

    public function test_a_denial_carries_its_reason(): void
    {
        $reply = json_decode($this->render('shell command as text', Decision::deny('Save it first.'))->stdout, true);

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

        $settled = $capabilities->rewrites->settle($rewrite, $stackBefore);
        $reply = json_decode($this->renderAnswer('shell command as text', $settled)->stdout, true);

        $this->assertSame([], $settled->stack->frameIds());
        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(ProgramReplies::REWRITE_REFUSAL, $reply['hookSpecificOutput']['permissionDecisionReason']);
        $this->assertArrayNotHasKey('updatedInput', $reply['hookSpecificOutput']);
    }

    public function test_a_rewrite_reaching_the_renderer_is_refused_too(): void
    {
        $reply = json_decode($this->render('shell command as text', Decision::rewrite('journal run tests'))->stdout, true);

        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertArrayNotHasKey('updatedInput', $reply['hookSpecificOutput']);
    }

    public function test_the_inputs_codex_has_no_callback_for_are_left_unmapped(): void
    {
        foreach (self::fixture('capabilities.json')['unmapped inputs'] as $method) {
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
        $this->assertInstanceOf(JournalCall::class, $call);

        return ($call->render)($answer);
    }

    private function inputOf(NativeCall $call): HookInput
    {
        $this->assertInstanceOf(JournalCall::class, $call);

        return $call->input;
    }

    private function adapter(): CodexAdapter
    {
        return $this->app->make(CodexAdapter::class);
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
        return json_decode((string) file_get_contents(dirname(__DIR__, 3).'/Fixtures/Hooks/Codex/'.$file), true, flags: JSON_THROW_ON_ERROR);
    }
}
