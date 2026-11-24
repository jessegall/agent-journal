<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Contracts\Processes\ShellCommandParser;
use App\Enums\AnswerType;
use App\Enums\NoSubject;
use App\Enums\ShellDialect;
use App\Exceptions\RepeatedCommandRewrite;
use App\Support\Decisions\Decision;
use App\Support\Decisions\MessageLine;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\References\StateReference;
use App\Support\Stack\AgentStack;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\HookAnswer;
use App\Support\Stack\HookRewrite;
use App\Support\States\AgentState;
use App\Support\States\ReadyState;
use App\Support\Storage\WalkStep;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Fixtures\Hooks\RewritingState;
use Tests\Fixtures\Hooks\ShellAnswerState;
use Tests\Support\TestActors;
use Tests\Support\TestText;
use Tests\TestCase;

final class HookRewriteTest extends TestCase
{
    private const string ORIGINAL = 'Original context.';

    private const string REFUSAL = 'The replacement is refused.';

    private const string REFUSAL_CONTEXT = 'Refusal context.';

    private const string ACCEPTED = 'Accepted context.';

    private const string ORIGINAL_LINE = 'composer test';

    private const string ALIAS = 'journal run tests';

    public function test_the_main_agent_admits_a_rewrite_to_a_command_alias(): void
    {
        $rewriter = new RewritingState([self::ORIGINAL_LINE => self::ALIAS]);

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command(self::ORIGINAL_LINE));

        $this->assertSame(AnswerType::Rewrite, $answer->decision->answerType());
        $this->assertSame(self::ALIAS, $answer->decision->replacementLine());
        $this->assertSame(
            ['rewriter rewrite', 'ready delegate', 'rewriter delegate', 'ready delegate'],
            $this->stepsOf($answer),
        );
        $this->assertSame(2, $rewriter->askedCount);
    }

    public function test_a_replacement_a_lower_frame_refuses_is_denied(): void
    {
        $rewriter = new RewritingState(['composer test' => 'journal run tests --write']);

        $answer = $this->rewrite()->answer($this->refusingStack($rewriter), $this->command('composer test'));

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(self::REFUSAL, $answer->decision->refusalReason());
        $steps = ['rewriter rewrite', 'guard rewrite', 'ready delegate', 'rewriter delegate', 'guard deny'];
        $this->assertSame($steps, $this->stepsOf($answer));
        $this->assertSame([self::ORIGINAL, self::REFUSAL_CONTEXT], $answer->context);
        $this->assertSame([self::ORIGINAL, self::REFUSAL_CONTEXT], $answer->messages);
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

    public function test_a_lower_denial_keeps_the_original_input_and_stops_rewrite_parsing(): void
    {
        $rewriter = new RewritingState(['composer test' => 'git status']);
        $guard = new ShellAnswerState(fn (ShellCommandRequested $input) => Decision::deny(TestText::of($input->command->source)));
        $parser = $this->createMock(ShellCommandParser::class);
        $parser->expects($this->never())->method('parse');

        $answer = new HookRewrite($parser)->answer($this->stack($rewriter, $guard), $this->command(self::ORIGINAL_LINE));

        $this->assertSame(self::ORIGINAL_LINE, $answer->decision->refusalReason());
        $this->assertSame(['rewriter rewrite', 'guard deny'], $this->stepsOf($answer));
    }

    public function test_an_accepted_rewrite_keeps_both_walks_context_and_messages(): void
    {
        $rewriter = new ShellAnswerState(fn (ShellCommandRequested $input) => match ($input->command->source) {
            'composer test' => [new MessageLine(TestText::of(self::ORIGINAL)), Decision::rewrite('git status')],
            default => new MessageLine(TestText::of(self::ACCEPTED)),
        });

        $answer = $this->rewrite()->answer($this->stack($rewriter), $this->command('composer test'));

        $this->assertTrue($answer->isRewrite());
        $this->assertSame([self::ORIGINAL, self::ACCEPTED], $answer->context);
        $this->assertSame($answer->context, $answer->messages);
    }

    private function rewrite(): HookRewrite
    {
        return new HookRewrite(new ListedCommandParser());
    }

    private function stack(AgentState $rewriter, ShellAnswerState ...$guards): AgentStack
    {
        $ready = new ReadyState(new FixedOperationPolicy(), new AllowedStops());

        return new AgentStack([
            $this->frame('ready', $ready, bottom: true),
            ...array_map(fn (ShellAnswerState $guard) => $this->frame('guard', $guard), $guards),
            $this->frame('rewriter', $rewriter),
        ], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1'));
    }

    private function refusingStack(RewritingState $rewriter): AgentStack
    {
        $guard = new ShellAnswerState(fn (ShellCommandRequested $input) => match ($input->command->source) {
            'composer test' => [new MessageLine(TestText::of(self::ORIGINAL)), Decision::rewrite('journal run tests --write')],
            default => [new MessageLine(TestText::of(self::REFUSAL_CONTEXT)), Decision::deny(TestText::of(self::REFUSAL))],
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
            fn (WalkStep $step) => "{$step->frameId} {$step->answer->value}",
            $answer->steps,
        );
    }
}
