<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Values\StackTarget;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Exceptions\RepeatedCommandRewrite;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\References\StateReference;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\Frames\Frame;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\Stack\HookRewrite;
use App\Hooks\States\AgentState;
use App\Hooks\States\ReadyState;
use App\Hooks\Storage\WalkStep;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Enums\ShellDialect;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Fixtures\Hooks\MarkedShellState;
use Tests\Fixtures\Hooks\RewritingState;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Support\TestActors;

final class HookRewriteTest extends TestCase
{
    private const string ORIGINAL_LINE = 'composer test';

    private const string REPLACEMENT_LINE = 'journal run tests';

    private const string REFUSAL_REASON = 'The replacement is refused.';

    public function test_the_main_agent_admits_a_rewrite_to_a_command_alias(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => self::REPLACEMENT_LINE]);

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command(self::ORIGINAL_LINE));

        $this->assertSame(AnswerType::Rewrite, $answer->decision->answerType());
        $this->assertSame(self::REPLACEMENT_LINE, $answer->decision->replacementLine());
        $this->assertSame(
            ['rewriter rewrite keep', 'rewriter delegate keep'],
            $this->stepsOf($answer),
        );
        $this->assertSame(2, $rewriter->askedCount);
    }

    public function test_a_replacement_a_lower_frame_refuses_is_denied(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => 'journal run tests --write']);

        $answer = $this->rewrite()->answer($this->refusingStack($rewriter), $this->command(self::ORIGINAL_LINE));

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(self::REFUSAL_REASON, $answer->decision->refusalReason());
        $steps = ['rewriter rewrite keep', 'guard rewrite keep', 'rewriter delegate keep', 'guard deny keep'];
        $this->assertSame($steps, $this->stepsOf($answer));
        $this->assertSame(['Original context.', 'Refusal context.'], $answer->context);
        $this->assertSame(['Original context.', 'Refusal context.'], $answer->messages);
    }

    public function test_a_refused_replacement_leaves_no_child_the_rewrite_pushed(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => 'journal run tests --write'], $this->guide());

        $answer = $this->rewrite()->answer($this->refusingStack($rewriter), $this->command(self::ORIGINAL_LINE));

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(['ready', 'guard', 'rewriter'], $answer->stack->frameIds());
    }

    public function test_an_admitted_replacement_keeps_the_child_the_rewrite_pushed(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => self::REPLACEMENT_LINE], $this->guide());

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command(self::ORIGINAL_LINE));

        $this->assertSame(AnswerType::Rewrite, $answer->decision->answerType());
        $this->assertSame(['ready', 'rewriter', 'pushed-1'], $answer->stack->frameIds());
        $this->assertSame(
            ['rewriter rewrite push', 'pushed-1 delegate keep'],
            $this->stepsOf($answer),
        );
    }

    public function test_a_second_rewrite_is_an_error(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => 'git status', 'git status' => self::REPLACEMENT_LINE]);

        $this->expectException(RepeatedCommandRewrite::class);

        $this->rewrite()->answer($this->stack($rewriter), $this->command(self::ORIGINAL_LINE));
    }

    public function test_a_command_nobody_rewrites_is_walked_once(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => self::REPLACEMENT_LINE]);

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command('git status'));

        $this->assertSame(AnswerType::Allow, $answer->decision->answerType());
        $this->assertSame(1, $rewriter->askedCount);
    }

    public function test_marked_delegate_replaces_a_rewrite_before_the_parser_is_called(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => 'git status']);
        $guard = new MarkedShellState(fn () => Decision::message('Continue with the original line.'));
        $parser = $this->createMock(ShellCommandParser::class);
        $parser->expects($this->never())->method('parse');

        $stack = $this->stack($rewriter, $guard);
        $answer = new HookRewrite($parser)->answer($stack, $this->command(self::ORIGINAL_LINE));

        $this->assertTrue($answer->isAllowed());
        $this->assertSame(['rewriter rewrite keep', 'guard delegate keep'], $this->stepsOf($answer));
        $this->assertSame(['Continue with the original line.'], $answer->messages);
        $this->assertSame(1, $rewriter->askedCount);
    }

    public function test_marked_denial_keeps_the_original_input_and_stops_rewrite_parsing(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => 'git status']);
        $guard = new MarkedShellState(fn (ShellCommandRequested $input) => Decision::deny($input->command->source));
        $parser = $this->createMock(ShellCommandParser::class);
        $parser->expects($this->never())->method('parse');

        $stack = $this->stack($rewriter, $guard);
        $answer = new HookRewrite($parser)->answer($stack, $this->command(self::ORIGINAL_LINE));

        $this->assertSame(self::ORIGINAL_LINE, $answer->decision->refusalReason());
        $this->assertSame(['rewriter rewrite keep', 'guard deny keep'], $this->stepsOf($answer));
    }

    public function test_an_accepted_rewrite_keeps_both_walks_context_and_messages(): void
    {
        $rewriter = new MarkedShellState(fn (ShellCommandRequested $input) => match ($input->command->source) {
            self::ORIGINAL_LINE => Decision::rewrite('git status')->withMessage('Original context.'),
            default => Decision::allow()->withMessage('Accepted context.'),
        });

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command(self::ORIGINAL_LINE));

        $this->assertTrue($answer->isRewrite());
        $this->assertSame(['Original context.', 'Accepted context.'], $answer->context);
        $this->assertSame($answer->context, $answer->messages);
    }

    private function rewrite(): HookRewrite
    {
        return new HookRewrite(new ListedCommandParser());
    }

    private function stack(AgentState $rewriter, MarkedShellState ...$guards): AgentStack
    {
        $ready = new ReadyState(new FixedOperationPolicy(), new AllowedStops());
        $factory = new InMemoryStateFactory(['guide' => fn () => ScriptedState::delegating()]);

        return new AgentStack([
            $this->frame('ready', $ready, bottom: true),
            ...array_map(fn (MarkedShellState $guard) => $this->frame('guard', $guard), $guards),
            $this->frame('rewriter', $rewriter),
        ], $factory, new StackTarget('agent-1', 'session-1'));
    }

    private function refusingStack(RewritingState $rewriter): AgentStack
    {
        $guard = new MarkedShellState(fn (ShellCommandRequested $input) => match ($input->command->source) {
            self::ORIGINAL_LINE => Decision::rewrite('journal run tests --write')->withMessage('Original context.'),
            default => Decision::deny(self::REFUSAL_REASON)->withMessage('Refusal context.'),
        });

        return $this->stack($rewriter, $guard);
    }

    private function frame(string $id, AgentState $state, bool $bottom = false): Frame
    {
        return new Frame(
            $id,
            new StateReference($id, NoSubject::None),
            $state,
            CarbonImmutable::now(),
            bottom: $bottom,
        );
    }

    private function guide(): StateReference
    {
        return new StateReference('guide', NoSubject::None);
    }

    private function command(string $line): ShellCommandRequested
    {
        return new ShellCommandRequested(
            TestActors::hookIdentity(1, 2, 'hook-1', 'digest'),
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
