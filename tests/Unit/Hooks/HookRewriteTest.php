<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Domain\Hooks\Decisions\AnswerKind;
use App\Domain\Hooks\Decisions\NoSubject;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\ShellDialect;
use App\Domain\Hooks\Stack\AgentStack;
use App\Domain\Hooks\Stack\Frame;
use App\Domain\Hooks\Stack\HookAnswer;
use App\Domain\Hooks\Stack\HookRewrite;
use App\Domain\Hooks\Stack\RepeatedCommandRewrite;
use App\Domain\Hooks\Stack\WalkStep;
use App\Domain\Hooks\States\AgentState;
use App\Domain\Hooks\States\ReadyStateType;
use App\Domain\Hooks\States\StateType;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Fixtures\Hooks\RewritingState;
use Tests\Fixtures\Hooks\ScriptedState;

final class HookRewriteTest extends TestCase
{
    public function test_without_the_rewrite_the_main_agent_refuses_the_unsaved_test_run(): void
    {
        $answer = $this->rewrite()->answer($this->stack(ReadyStateType::MainAgent, new RewritingState([])), $this->command('composer test'));

        $this->assertSame(AnswerKind::Deny, $answer->decision->answerKind());
        $this->assertSame(['rewriter delegate keep', 'ready deny keep'], $this->stepsOf($answer));
    }

    public function test_the_main_agent_admits_a_rewrite_to_a_saved_command(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests']);

        $answer = $this->rewrite()->answer($this->stack(ReadyStateType::MainAgent, $rewriter), $this->command('composer test'));

        $this->assertSame(AnswerKind::Rewrite, $answer->decision->answerKind());
        $this->assertSame('journal run tests', $answer->decision->replacementLine());
        $this->assertSame(['rewriter rewrite keep', 'rewriter delegate keep', 'ready allow keep'], $this->stepsOf($answer));
        $this->assertSame(2, $rewriter->askedCount);
    }

    public function test_a_read_only_helper_refuses_a_replacement_that_writes(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests --write']);

        $answer = $this->rewrite()->answer($this->stack(ReadyStateType::ReadOnlyHelper, $rewriter), $this->command('composer test'));

        $this->assertSame(AnswerKind::Deny, $answer->decision->answerKind());
        $this->assertStringContainsString('changes no files', $answer->decision->answer->reason->text);
        $this->assertSame(['rewriter rewrite keep', 'rewriter delegate keep', 'ready deny keep'], $this->stepsOf($answer));
    }

    public function test_a_refused_replacement_leaves_no_child_the_rewrite_pushed(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests --write'], $this->guide());
        $stack = $this->stack(ReadyStateType::ReadOnlyHelper, $rewriter);

        $answer = $this->rewrite()->answer($stack, $this->command('composer test'));

        $this->assertSame(AnswerKind::Deny, $answer->decision->answerKind());
        $this->assertSame(['ready', 'rewriter'], $answer->stack->frameIds());
    }

    public function test_an_admitted_replacement_keeps_the_child_the_rewrite_pushed(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests'], $this->guide());

        $answer = $this->rewrite()->answer($this->stack(ReadyStateType::MainAgent, $rewriter), $this->command('composer test'));

        $this->assertSame(AnswerKind::Rewrite, $answer->decision->answerKind());
        $this->assertSame(['ready', 'rewriter', 'pushed-1'], $answer->stack->frameIds());
        $this->assertSame(['rewriter rewrite push', 'pushed-1 delegate keep', 'rewriter delegate keep', 'ready allow keep'], $this->stepsOf($answer));
    }

    public function test_a_second_rewrite_is_an_error(): void
    {
        $rewriter = new RewritingState(['composer test' => 'git status', 'git status' => 'journal run tests']);

        $this->expectException(RepeatedCommandRewrite::class);

        $this->rewrite()->answer($this->stack(ReadyStateType::MainAgent, $rewriter), $this->command('composer test'));
    }

    public function test_a_command_nobody_rewrites_is_walked_once(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests']);

        $answer = $this->rewrite()->answer($this->stack(ReadyStateType::MainAgent, $rewriter), $this->command('git status'));

        $this->assertSame(AnswerKind::Allow, $answer->decision->answerKind());
        $this->assertSame(1, $rewriter->askedCount);
    }

    private function rewrite(): HookRewrite
    {
        return new HookRewrite(new ListedCommandParser);
    }

    private function stack(ReadyStateType $role, RewritingState $rewriter): AgentStack
    {
        $noSubject = fn (string $typeKey) => new StateReference($typeKey, NoSubject::None);
        $factory = new InMemoryStateFactory(['guide' => fn () => ScriptedState::delegating()]);

        return new AgentStack([
            new Frame('ready', $noSubject($role->value), $this->bottomOf($role), bottom: true),
            new Frame('rewriter', $noSubject('rewriter'), $rewriter),
        ], $factory);
    }

    private function bottomOf(StateType $role): AgentState
    {
        return $role->stateFor(new StateReference('ready', NoSubject::None));
    }

    private function guide(): StateReference
    {
        return new StateReference('guide', NoSubject::None);
    }

    private function command(string $line): ShellCommandRequested
    {
        return new ShellCommandRequested(
            new HookIdentity(1, 2, 'hook-1', 'digest'),
            (new ListedCommandParser)->parse($line, ShellDialect::Bash),
        );
    }

    /**
     * @return list<string>
     */
    private function stepsOf(HookAnswer $answer): array
    {
        return array_map(
            fn (WalkStep $step) => "{$step->frameId} {$step->answer->value} {$step->change->value}",
            $answer->steps,
        );
    }
}
