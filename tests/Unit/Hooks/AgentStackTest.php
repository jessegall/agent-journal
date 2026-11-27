<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Access\Contracts\OperationPolicy;
use App\Engine\Enums\NoSubject;
use App\Hooks\Enums\AnswerType;
use App\Links\Commands\UnlinkRecords\UnlinkRecordsCommand;
use App\Profiles\Enums\AccessRuleType;
use App\Stacks\AgentStack;
use App\Stacks\AgentState;
use App\Stacks\Decisions\ContextLine;
use App\Stacks\Decisions\MessageLine;
use App\Stacks\Exceptions\BottomStateCannotFinish;
use App\Stacks\Exceptions\HookAnswerRefused;
use App\Stacks\Exceptions\InvalidHookAnswer;
use App\Stacks\Exceptions\MissingBottomState;
use App\Stacks\Exceptions\StackTooDeep;
use App\Stacks\Frames\Frame;
use App\Stacks\HookAnswer;
use App\Stacks\ReadyState;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\Storage\WalkStep;
use App\Values\AccessDecision;
use App\Values\AgentText;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Closure;
use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Support\States\FollowSequenceState;
use Domain\Tasks\TasksDomain;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\AnswerStates;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\InMemoryTasks;
use Tests\Fixtures\Hooks\InMemoryTaskState;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Fixtures\Hooks\ShellAnswerState;
use Tests\Fixtures\Hooks\Stacks\FinishableState;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;
use Tests\Fixtures\Hooks\Stacks\SingleState;
use Tests\Fixtures\Hooks\StopAnswerState;
use Tests\Fixtures\Hooks\SubjectIds;
use Tests\Fixtures\Hooks\SwitchableState;
use Tests\Support\DomainBoot;
use Tests\Support\TestActors;
use Tests\Support\TestText;
use Tests\TestCase;

final class AgentStackTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SequencesDomain::class, TasksDomain::class);
    }

    public function test_the_top_denial_answers_a_stop_and_no_state_below_it_is_asked(): void
    {
        $stop = $this->stop();
        $both = $this->exampleStack(isTaskStarted: true, doesMessageWait: true);

        $this->assertSame(['message-95 deny'], $this->stepsOf($both->answer($stop, TestText::renderer())));

        $answered = $this->exampleStack(isTaskStarted: true, doesMessageWait: false)->withoutExposedInactive();

        $this->assertSame(['ready', 'task-42'], $answered->frameIds());
        $this->assertSame(['task-42 deny'], $this->stepsOf($answered->answer($stop, TestText::renderer())));

        $done = $this->exampleStack(isTaskStarted: false, doesMessageWait: false)->withoutExposedInactive();
        $answer = $done->answer($stop, TestText::renderer());

        $this->assertTrue($answer->isAllowed());
        $this->assertSame(['ready delegate'], $this->stepsOf($answer));
    }

    public function test_a_shell_write_is_refused_by_the_message_and_the_task_is_not_asked(): void
    {
        $answer = $this->exampleStack(isTaskStarted: true, doesMessageWait: true)
            ->answer(HookInputs::of('shell command'), TestText::renderer());

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(['message-95 deny'], $this->stepsOf($answer));
    }

    public function test_a_pushed_sequence_answers_the_next_stop_before_the_task(): void
    {
        $factory = new InMemoryStateFactory([
            'sequences.follow' => fn () => new FollowSequenceState(
                'run-8',
                8,
                ['Run the phase tests.'],
            ),
        ]);
        $stack = new AgentStack([
            $this->ready(),
            new Frame(
                'task-42',
                $this->reference('tasks.work', '42'),
                new InMemoryTaskState(42, 1, new InMemoryTasks([42])),
                CarbonImmutable::now(),
            ),
        ], $factory, new StackTarget('agent-1', 'session-1'));

        $stack = $stack->withStateOnTop($this->reference('sequences.follow', '8'));
        $answer = $stack->answer($this->stop(), TestText::renderer());

        $this->assertSame(['ready', 'task-42', 'pushed-1'], $stack->frameIds());
        $this->assertSame(['pushed-1 deny'], $this->stepsOf($answer));
        $this->assertSame($answer->steps[0]->denialReason, TestText::words($answer->decision->refusalReason()));
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_states_that_pass_let_every_state_below_answer_and_the_hook_is_allowed(string $hook): void
    {
        $input = HookInputs::of($hook);
        $top = ScriptedState::passing();
        $middle = ScriptedState::passing();
        $stack = $this->stack($this->ready(), $this->frame('middle', $middle), $this->frame('top', $top));

        $answer = $stack->answer($input, TestText::renderer());

        $this->assertSame(['top delegate', 'middle delegate', 'ready delegate'], $this->stepsOf($answer));
        $this->assertTrue($answer->isAllowed());
        $this->assertSame([1, 1], [$top->askedCount, $middle->askedCount]);
        $this->assertSame($input->methodName(), $answer->steps[0]->hookMethod);
    }

    public function test_file_policy_is_enforced_under_a_state_that_passes(): void
    {
        $passing = $this->frame('guide', ScriptedState::passing());
        $stack = $this->stack($this->ready(changesFiles: false), $passing);

        $file = $stack->answer(HookInputs::of('file edit'), TestText::renderer());

        $this->assertSame(['guide delegate', 'ready deny'], $this->stepsOf($file));
    }

    public function test_a_tool_handler_that_passes_cannot_hide_the_operation_policy(): void
    {
        $refusal = AccessDecision::refused(
            AccessRuleType::NotGranted,
            AgentText::of('core.access.profile_does_not_grant_pair'),
        );
        $policy = $this->createStub(OperationPolicy::class);
        $policy->method('assess')->willReturn($refusal);
        $ready = new Frame(
            'ready',
            $this->reference('ready'),
            new ReadyState($policy, new AllowedStops(), 'agent', 'session'),
            CarbonImmutable::now(),
            isBottom: true,
        );
        $stack = $this->stack($ready, $this->frame('guide', ScriptedState::passing()));

        $answer = $stack->answer(HookInputs::of('tool requested'), TestText::renderer());

        $this->assertSame(
            TestText::words(AgentText::of('core.access.refused', ['reason' => $refusal->reason])),
            TestText::words($answer->decision->refusalReason()),
        );
        $this->assertSame(['guide delegate', 'ready deny'], $this->stepsOf($answer));
    }

    public function test_hidden_message_and_sequence_guards_add_no_context_of_their_own_during_the_walk(): void
    {
        $stack = $this->stack(
            $this->ready(),
            $this->frame('sequence', new FollowSequenceState('run-8', 8, ['Run the phase tests.'])),
            $this->answeringFrame(true),
            $this->frame('guide', ScriptedState::passing()),
        );

        $this->assertSame([], $stack->answer(HookInputs::of('session start'), TestText::renderer())->context);
        $this->assertSame([], $stack->answer(HookInputs::of('compaction'), TestText::renderer())->context);
    }

    public function test_no_state_below_a_denial_is_asked(): void
    {
        $below = ScriptedState::passing();
        $stack = $this->stack(
            $this->ready(),
            $this->frame('below', $below),
            $this->frame('top', new ScriptedState(Decision::deny(TestText::of('Not now.')))),
        );

        $answer = $stack->answer(HookInputs::of('prompt'), TestText::renderer());

        $this->assertSame(['top deny'], $this->stepsOf($answer));
        $this->assertSame(0, $below->askedCount);
    }

    public function test_lines_are_collected_from_the_top_down_and_messages_among_them_are_kept(): void
    {
        $middle = new ContextLine(TestText::of('From the middle.'));
        $top = new MessageLine(TestText::of('From the top.'));
        $stack = $this->stack(
            $this->ready(),
            $this->frame('middle', new StopAnswerState($middle)),
            $this->frame('top', new StopAnswerState($top)),
        );

        $answer = $stack->answer($this->stop(), TestText::renderer());

        $this->assertSame([TestText::words($top->text), TestText::words($middle->text)], $answer->context);
        $this->assertSame([TestText::words($top->text)], $answer->messages);
        $this->assertSame([1, 1, 0], array_column($answer->steps, 'contextCount'));
    }

    public function test_the_first_denial_answers_with_the_lines_yielded_above_and_before_it(): void
    {
        $above = new ContextLine(TestText::of('Above.'));
        $before = new MessageLine(TestText::of('Before the denial.'));
        $denial = Decision::deny(TestText::of('First denial.'));
        $below = ScriptedState::passing();
        $stack = $this->stack(
            $this->ready(),
            $this->frame('below', $below),
            $this->frame('denier', new StopAnswerState((function () use ($before, $denial) {
                yield $before;

                yield $denial;
            })())),
            $this->frame('top', new StopAnswerState($above)),
        );

        $answer = $stack->answer($this->stop(), TestText::renderer());

        $this->assertSame($denial, $answer->decision);
        $this->assertSame([TestText::words($above->text), TestText::words($before->text)], $answer->context);
        $this->assertSame([TestText::words($before->text)], $answer->messages);
        $this->assertSame(['top delegate', 'denier deny'], $this->stepsOf($answer));
        $this->assertSame(
            [null, TestText::words($denial->refusalReason())],
            array_column($answer->steps, 'denialReason'),
        );
        $this->assertSame(0, $below->askedCount);
    }

    public function test_the_highest_rewrite_answers_when_no_state_denies(): void
    {
        $highest = Decision::rewrite('ls -la');
        $stack = $this->stack(
            $this->ready(),
            $this->frame('lower', new ShellAnswerState(fn () => Decision::rewrite('ls'))),
            $this->frame('top', new ShellAnswerState(fn () => $highest)),
        );

        $answer = $stack->answer(HookInputs::of('shell command'), TestText::renderer());

        $this->assertSame($highest, $answer->decision);
        $this->assertSame(['top rewrite', 'lower rewrite', 'ready delegate'], $this->stepsOf($answer));
    }

    public function test_commands_and_events_are_gathered_in_order_from_the_states_asked(): void
    {
        $first = new UnlinkRecordsCommand(TestActors::record('tasks.task', 1), TestActors::record('tasks.task', 2));
        $event = new TaskClosed(5);
        $second = new UnlinkRecordsCommand(TestActors::record('tasks.task', 3), TestActors::record('tasks.task', 4));
        $stack = $this->stack(
            $this->ready(),
            $this->frame('below', new StopAnswerState($second)),
            $this->frame('top', new StopAnswerState((function () use ($first, $event) {
                yield $first;

                yield $event;
            })())),
        );

        $this->assertSame([$first, $event, $second], $stack->answer($this->stop(), TestText::renderer())->effects);
    }

    /**
     * Each answer is made when its test runs, once the texts it holds can be rendered.
     *
     * @return array<string, array{Closure(): mixed}>
     */
    public static function refusedAnswers(): array
    {
        return [
            'an allow' => [fn () => Decision::allow()],
            'a yield after the decision' => [
                function () {
                    yield Decision::deny(TestText::of('Held.'));

                    yield new ContextLine(TestText::of('Too late.'));
                },
            ],
            'a yielded thing that is no answer' => [function () {
                yield 3;
            }],
        ];
    }

    #[DataProvider('refusedAnswers')]
    public function test_an_answer_a_state_may_not_give_is_refused(Closure $answer): void
    {
        $stack = $this->stack($this->ready(), $this->frame('top', new StopAnswerState($answer())));

        $this->expectException(HookAnswerRefused::class);

        $stack->answer($this->stop(), TestText::renderer());
    }

    public function test_a_generator_that_yields_something_that_is_no_answer_is_refused_at_that_step(): void
    {
        $steps = (function () {
            yield new ContextLine(TestText::of('First.'));

            yield 'not an answer';
        })();
        $stack = $this->stack($this->ready(), $this->frame('top', new StopAnswerState($steps)));

        $this->expectException(HookAnswerRefused::class);

        $stack->answer($this->stop(), TestText::renderer());
    }

    public function test_the_bottom_state_cannot_finish(): void
    {
        $bottom = $this->ready();
        $stack = $this->stack($bottom);

        $this->expectException(BottomStateCannotFinish::class);

        $stack->withoutFrame($bottom);
    }

    public function test_a_finished_bottom_state_stays_when_the_exposed_frames_are_popped(): void
    {
        $bottom = new ScriptedState(Decision::delegate(), hasFinished: true);
        $stack = $this->stack(
            new Frame('ready', $this->reference('ready'), $bottom, CarbonImmutable::now(), isBottom: true),
        );

        $this->assertSame(['ready'], $stack->withoutExposedInactive()->frameIds());
    }

    public function test_a_stack_without_states_has_no_bottom(): void
    {
        $this->expectException(MissingBottomState::class);

        $this->stack()->answer($this->stop(), TestText::renderer());
    }

    public function test_a_hook_refuses_a_decision_it_cannot_take(): void
    {
        $stack = $this->stack($this->ready(), $this->frame('top', new ScriptedState(Decision::rewrite('ls'))));

        $this->expectException(InvalidHookAnswer::class);

        $stack->answer(HookInputs::of('prompt'), TestText::renderer());
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function hooksThatOnlyReport(): iterable
    {
        yield 'a session start' => ['session start'];

        yield 'a compaction' => ['compaction'];

        yield 'a finished tool call' => ['tool finished'];

        yield 'a session end' => ['session end'];
    }

    #[DataProvider('hooksThatOnlyReport')]
    public function test_a_hook_that_only_reports_what_happened_refuses_a_deny(string $hook): void
    {
        $refusing = new ScriptedState(Decision::deny(TestText::of('Not now.')));
        $stack = $this->stack($this->ready(), $this->frame('top', $refusing));

        $this->expectException(InvalidHookAnswer::class);

        $stack->answer(HookInputs::all()[$hook], TestText::renderer());
    }

    public function test_pushing_a_state_already_on_the_stack_changes_nothing(): void
    {
        $stack = $this->exampleStack(isTaskStarted: true, doesMessageWait: true);

        $this->assertSame($stack, $stack->withStateOnTop($this->reference('tasks.work', '42')));
        $this->assertSame(['ready', 'task-42', 'message-95'], $stack->frameIds());
    }

    public function test_a_state_reused_per_type_keeps_one_frame_and_one_reused_per_subject_keeps_one_per_subject(): void
    {
        $factory = new InMemoryStateFactory([
            'single' => fn () => new SingleState(),
            'guide' => fn (StateReference $reference) => new FinishableState(
                $this->subjectOf($reference),
                new FinishedSubjects(),
            ),
        ]);
        $stack = new AgentStack([$this->ready()], $factory, new StackTarget('agent-1', 'session-1'));

        $pushed = $stack
            ->withStateOnTop($this->reference('single', 'first'))
            ->withStateOnTop($this->reference('single', 'second'))
            ->withStateOnTop($this->reference('guide', 'first'))
            ->withStateOnTop($this->reference('guide', 'second'))
            ->withStateOnTop($this->reference('guide', 'first'));

        $this->assertSame(['ready', 'pushed-1', 'pushed-2', 'pushed-3'], $pushed->frameIds());
    }

    public function test_a_push_of_a_reused_state_replaces_its_finished_frame_with_a_new_one_on_top(): void
    {
        $done = new FinishedSubjects();
        $done->finished = ['guide'];
        $factory = new InMemoryStateFactory(['guide' => fn () => new FinishableState('guide', new FinishedSubjects())]);
        $finished = new Frame(
            'guide-1',
            $this->reference('guide', 'guide'),
            new FinishableState('guide', $done),
            CarbonImmutable::now(),
        );
        $stack = new AgentStack(
            [$this->ready(), $finished, $this->frame('top', ScriptedState::passing())],
            $factory,
            new StackTarget('agent-1', 'session-1'),
        );

        $pushed = $stack->withStateOnTop($this->reference('guide', 'guide'));

        $this->assertSame(['ready', 'top', 'pushed-1'], $pushed->frameIds());
    }

    public function test_a_delegate_passes_the_hook_to_the_state_below_which_decides(): void
    {
        $stack = $this->stack(
            $this->ready(),
            $this->frame('below', new ScriptedState(Decision::deny(TestText::of('Not now.')))),
            $this->frame('top', new ScriptedState(Decision::delegate())),
        );

        $answer = $stack->answer($this->stop(), TestText::renderer());

        $this->assertSame(['top delegate', 'below deny'], $this->stepsOf($answer));
        $this->assertFalse($answer->isAllowed());
    }

    public function test_a_push_onto_a_full_stack_is_refused(): void
    {
        $frames = array_map(
            fn (int $number) => $this->frame("frame-{$number}", ScriptedState::passing()),
            range(1, AgentStack::DEPTH_LIMIT - 1),
        );
        $factory = new InMemoryStateFactory(['guide' => fn () => ScriptedState::passing()]);
        $stack = new AgentStack([$this->ready(), ...$frames], $factory, new StackTarget('agent-1', 'session-1'));

        $this->expectException(StackTooDeep::class);

        $stack->withStateOnTop($this->reference('guide'));
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_a_finished_state_is_never_asked(string $hook): void
    {
        $input = HookInputs::of($hook);
        $stack = $this->exampleStack(isTaskStarted: false, doesMessageWait: false);

        $this->assertSame(
            ['ready'],
            array_map(fn (WalkStep $step) => $step->frameId, $stack->answer($input, TestText::renderer())->steps),
        );
    }

    public function test_a_finished_state_in_the_middle_stays_buried_when_the_top_is_popped(): void
    {
        $stack = $this->exampleStack(isTaskStarted: false, doesMessageWait: true);

        $this->assertSame(['ready', 'task-42', 'message-95'], $stack->withoutExposedInactive()->frameIds());
        $this->assertSame(['ready'], $stack->poppedOf($stack->frames()[2])->frameIds());
    }

    public function test_the_records_list_every_frame_bottom_first(): void
    {
        $records = $this->exampleStack(isTaskStarted: true, doesMessageWait: true)->records()->all();

        $this->assertSame(['ready', 'task-42', 'message-95'], array_map(fn ($record) => $record->id, $records));
        $this->assertSame([true, false, false], array_map(fn ($record) => $record->isBottom, $records));
        $this->assertTrue($records[1]->reference->isSameAs($this->reference('tasks.work', '42')));
    }

    public function test_a_step_keeps_its_typed_labels_through_an_array(): void
    {
        $step = WalkStep::from(
            [
                'frameId' => 'top',
                'stateType' => 'guide',
                'hookMethod' => 'onStop',
                'answer' => AnswerType::Deny,
                'contextCount' => 0,
            ],
        );

        $copy = WalkStep::from($step->toArray());

        $this->assertSame(AnswerType::Deny, $copy->answer);
        $this->assertSame($step->toArray(), $copy->toArray());
    }

    public function test_the_shown_instruction_is_the_top_live_state_that_has_one(): void
    {
        $task = new InMemoryTaskState(42, 1, new InMemoryTasks([42]));
        $stack = $this->stack(
            $this->ready(),
            $this->answeringFrame(true),
            new Frame('task-42', $this->reference('tasks.work', '42'), $task, CarbonImmutable::now()),
            $this->frame('guide', ScriptedState::passing()),
        );

        $this->assertEquals($task->instruction()->get(), $stack->instruction()->get());
        $this->assertTrue($this->stack($this->ready())->instruction()->isEmpty());
    }

    public function test_a_switched_off_top_frame_is_not_asked_and_the_frames_beneath_answer(): void
    {
        $switchedOff = new SwitchableState(false);
        $stack = $this->stack(
            $this->ready(),
            new Frame(
                'task-42',
                $this->reference('tasks.work', '42'),
                new InMemoryTaskState(42, 1, new InMemoryTasks([42])),
                CarbonImmutable::now(),
            ),
            $this->frame('review', $switchedOff),
        );

        $this->assertSame(['task-42 deny'], $this->stepsOf($stack->answer($this->stop(), TestText::renderer())));
        $this->assertSame(['ready', 'task-42', 'review'], $stack->frameIds());
    }

    public function test_only_the_inactive_frames_exposed_at_the_top_are_popped(): void
    {
        $stack = $this->stack(
            $this->ready(),
            $this->frame('review', new SwitchableState(false)),
            new Frame(
                'task-42',
                $this->reference('tasks.work', '42'),
                new InMemoryTaskState(42, 1, new InMemoryTasks([42])),
                CarbonImmutable::now(),
            ),
            $this->frame('notes', new SwitchableState(true)),
            $this->answeringFrame(false),
        );

        $this->assertSame(['ready', 'review', 'task-42', 'notes'], $stack->withoutExposedInactive()->frameIds());
    }

    private function exampleStack(bool $isTaskStarted, bool $doesMessageWait): AgentStack
    {
        return $this->stack(
            $this->ready(),
            new Frame(
                'task-42',
                $this->reference('tasks.work', '42'),
                new InMemoryTaskState(42, 1, new InMemoryTasks($isTaskStarted ? [42] : [])),
                CarbonImmutable::now(),
            ),
            $this->answeringFrame($doesMessageWait),
        );
    }

    private function stack(Frame ...$frames): AgentStack
    {
        return new AgentStack(
            array_values($frames),
            new InMemoryStateFactory(),
            new StackTarget('agent-1', 'session-1'),
        );
    }

    private function ready(bool $changesFiles = true): Frame
    {
        return new Frame(
            'ready',
            $this->reference('ready'),
            new ReadyState(new FixedOperationPolicy($changesFiles), new AllowedStops(), 'agent', 'session'),
            CarbonImmutable::now(),
            isBottom: true,
        );
    }

    private function frame(string $id, AgentState $state): Frame
    {
        return new Frame($id, $this->reference($id), $state, CarbonImmutable::now());
    }

    private function reference(string $typeKey, string|null $subjectId = null): StateReference
    {
        if ($subjectId === null) {
            return new StateReference($typeKey, NoSubject::None);
        }

        return new StateReference($typeKey, new SubjectReference(SubjectIds::of($subjectId), 1));
    }

    private function subjectOf(StateReference $reference): string
    {
        $this->assertInstanceOf(SubjectReference::class, $reference->subject);

        return $reference->subject->id;
    }

    private function stop(): StopRequested
    {
        $stop = HookInputs::of('stop');
        $this->assertInstanceOf(StopRequested::class, $stop);

        return $stop;
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

    private function answeringFrame(bool $doesMessageWait): Frame
    {
        $reference = $this->reference('core.messages.answer', '95');

        return new Frame(
            'message-95',
            $reference,
            $doesMessageWait ? AnswerStates::holding('95') : AnswerStates::answered(),
            CarbonImmutable::now(),
        );
    }
}
