<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Exceptions\RepeatedCommandRewrite;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\Frame;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\Stack\HookRewrite;
use App\Hooks\States\AgentState;
use App\Hooks\States\ReadyState;
use App\Hooks\Storage\WalkStep;
use App\Processes\Enums\ShellDialect;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\FixedFileEditPermission;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Fixtures\Hooks\RewritingState;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Support\TestIds;

final class HookRewriteTest extends TestCase
{
    public function test_the_main_agent_admits_a_rewrite_to_a_command_alias(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests']);

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command('composer test'));

        $this->assertSame(AnswerType::Rewrite, $answer->decision->answerType());
        $this->assertSame('journal run tests', $answer->decision->replacementLine());
        $this->assertSame(['rewriter rewrite keep', 'rewriter delegate keep', 'ready allow keep'], $this->stepsOf($answer));
        $this->assertSame(2, $rewriter->askedCount);
    }

    public function test_a_replacement_a_lower_frame_refuses_is_denied(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests --write']);

        $answer = $this->rewrite()->answer($this->refusingStack($rewriter), $this->command('composer test'));

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame('The replacement is refused.', $answer->decision->refusalReason());
        $steps = ['rewriter rewrite keep', 'rewriter delegate keep', 'ready deny keep'];
        $this->assertSame($steps, $this->stepsOf($answer));
    }

    public function test_a_refused_replacement_leaves_no_child_the_rewrite_pushed(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests --write'], $this->guide());

        $answer = $this->rewrite()->answer($this->refusingStack($rewriter), $this->command('composer test'));

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(['ready', 'rewriter'], $answer->stack->frameIds());
    }

    public function test_an_admitted_replacement_keeps_the_child_the_rewrite_pushed(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests'], $this->guide());

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command('composer test'));

        $this->assertSame(AnswerType::Rewrite, $answer->decision->answerType());
        $this->assertSame(['ready', 'rewriter', 'pushed-1'], $answer->stack->frameIds());
        $this->assertSame(['rewriter rewrite push', 'pushed-1 delegate keep', 'rewriter delegate keep', 'ready allow keep'], $this->stepsOf($answer));
    }

    public function test_a_second_rewrite_is_an_error(): void
    {
        $rewriter = new RewritingState(['composer test' => 'git status', 'git status' => 'journal run tests']);

        $this->expectException(RepeatedCommandRewrite::class);

        $this->rewrite()->answer($this->stack($rewriter), $this->command('composer test'));
    }

    public function test_a_command_nobody_rewrites_is_walked_once(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests']);

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command('git status'));

        $this->assertSame(AnswerType::Allow, $answer->decision->answerType());
        $this->assertSame(1, $rewriter->askedCount);
    }

    private function rewrite(): HookRewrite
    {
        return new HookRewrite(new ListedCommandParser());
    }

    private function stack(RewritingState $rewriter): AgentStack
    {
        return $this->stackOn(ReadyState::TYPE_KEY, new ReadyState(new FixedFileEditPermission()), $rewriter);
    }

    /**
     * A stack whose bottom frame refuses every line, so only a rewrite above it answers the original line.
     */
    private function refusingStack(RewritingState $rewriter): AgentStack
    {
        return $this->stackOn('refusing', new ScriptedState(Decision::deny('The replacement is refused.')), $rewriter);
    }

    private function stackOn(string $bottomTypeKey, AgentState $bottom, RewritingState $rewriter): AgentStack
    {
        $noSubject = fn (string $typeKey) => new StateReference($typeKey, NoSubject::None);
        $factory = new InMemoryStateFactory(['guide' => fn () => ScriptedState::delegating()]);

        return new AgentStack([
            new Frame('ready', $noSubject($bottomTypeKey), $bottom, CarbonImmutable::now(), bottom: true),
            new Frame('rewriter', $noSubject('rewriter'), $rewriter, CarbonImmutable::now()),
        ], $factory);
    }

    private function guide(): StateReference
    {
        return new StateReference('guide', NoSubject::None);
    }

    private function command(string $line): ShellCommandRequested
    {
        return new ShellCommandRequested(
            new HookIdentity(TestIds::of(1), TestIds::of(2), 'hook-1', 'digest'),
            new ListedCommandParser()->parse($line, ShellDialect::Bash),
        );
    }

    /**
     * @return list<string>
     */
    private function stepsOf(HookAnswer $answer): array
    {
        return array_map(
            fn (WalkStep $step) => "{$step->frameId} {$step->answer->value} {$step->transition->value}",
            $answer->steps,
        );
    }
}
