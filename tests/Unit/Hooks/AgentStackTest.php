<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\ChangeKind;
use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Exceptions\ActivityAllowed;
use App\Core\Hooks\Exceptions\BottomStateCannotFinish;
use App\Core\Hooks\Exceptions\BottomStateDelegated;
use App\Core\Hooks\Exceptions\CoveredStatePushed;
use App\Core\Hooks\Exceptions\InvalidHookAnswer;
use App\Core\Hooks\Exceptions\MissingBottomState;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Stack\AgentStack;
use App\Core\Hooks\Stack\Frame;
use App\Core\Hooks\Stack\HookAnswer;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\States\Ready;
use App\Core\Hooks\Storage\WalkStep;
use App\Domain\Chat\MessageWork;
use App\Domain\Chat\MessageWorkState;
use App\Domain\Chat\States\AnsweringMessage;
use App\Domain\Sequences\SequenceRunState;
use App\Domain\Sequences\SequenceWork;
use App\Domain\Sequences\States\FollowingSequence;
use App\Domain\Tasks\States\WorkingOnTask;
use App\Domain\Tasks\TaskWork;
use App\Domain\Tasks\TaskWorkState;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\TestCase;

final class AgentStackTest extends TestCase
{
    public function test_the_task_and_message_example_answers_one_obligation_at_a_time(): void
    {
        $stop = $this->stop();
        $both = $this->exampleStack(TaskWorkState::Active, MessageWorkState::Unanswered);

        $this->assertSame(['message-95 prevent_stop keep'], $this->stepsOf($both->answer($stop)));

        $answered = $this->exampleStack(TaskWorkState::Active, MessageWorkState::Answered)->withoutFinishedFrames();

        $this->assertSame(['ready', 'task-42'], $answered->frameIds());
        $this->assertSame(['task-42 prevent_stop keep'], $this->stepsOf($answered->answer($stop)));

        $done = $this->exampleStack(TaskWorkState::Finished, MessageWorkState::Answered)->withoutFinishedFrames();
        $answer = $done->answer($stop);

        $this->assertSame(AnswerKind::Allow, $answer->decision->answerKind());
        $this->assertSame(['ready allow keep'], $this->stepsOf($answer));
    }

    public function test_a_shell_write_is_refused_by_the_message_and_the_task_is_not_asked(): void
    {
        $answer = $this->exampleStack(TaskWorkState::Active, MessageWorkState::Unanswered)
            ->answer(HookInputs::all()['shell command']);

        $this->assertSame(AnswerKind::Deny, $answer->decision->answerKind());
        $this->assertSame(['message-95 deny keep'], $this->stepsOf($answer));
    }

    public function test_a_pushed_sequence_answers_the_next_stop_before_the_task(): void
    {
        $factory = new InMemoryStateFactory([
            'sequences.following' => fn () => new FollowingSequence(new SequenceWork(8, 3, 'Run the phase tests.', SequenceRunState::Running)),
        ]);
        $stack = new AgentStack([
            $this->ready(),
            new Frame('task-42', $this->reference('tasks.working', 42), new WorkingOnTask(new TaskWork(42, 1, TaskWorkState::Active))),
        ], $factory);

        $stack = $stack->withStateOnTop($this->reference('sequences.following', 8));
        $answer = $stack->answer($this->stop());

        $this->assertSame(['ready', 'task-42', 'pushed-1'], $stack->frameIds());
        $this->assertSame(['pushed-1 prevent_stop keep'], $this->stepsOf($answer));
        $this->assertStringContainsString('step 3', $answer->decision->refusalReason());
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_every_hook_walks_down_from_the_top_until_the_first_answer(HookInput $input): void
    {
        $top = ScriptedState::delegating();
        $middle = ScriptedState::delegating();
        $stack = $this->stack($this->ready(), $this->frame('middle', $middle), $this->frame('top', $top));

        $answer = $stack->answer($input);

        $this->assertSame(['top delegate keep', 'middle delegate keep', 'ready allow keep'], $this->stepsOf($answer));
        $this->assertSame([1, 1], [$top->askedCount, $middle->askedCount]);
        $this->assertSame($input->methodName(), $answer->steps[0]->hookMethod);
    }

    public function test_no_state_below_the_answering_state_is_asked(): void
    {
        $below = ScriptedState::delegating();
        $stack = $this->stack($this->ready(), $this->frame('below', $below), $this->frame('top', new ScriptedState(Decision::deny('Not now.'))));

        $answer = $stack->answer(HookInputs::all()['prompt']);

        $this->assertSame(['top deny keep'], $this->stepsOf($answer));
        $this->assertSame(0, $below->askedCount);
    }

    public function test_context_is_collected_from_the_top_down(): void
    {
        $stack = $this->stack(
            $this->ready(),
            $this->frame('middle', new ScriptedState(Decision::addContext('From the middle.'))),
            $this->frame('top', new ScriptedState(Decision::addContext('From the top.'))),
        );

        $this->assertSame(['From the top.', 'From the middle.'], $stack->answer($this->stop())->context);
    }

    public function test_a_pop_removes_the_state_and_the_walk_goes_on(): void
    {
        $stack = $this->stack($this->ready(), $this->frame('guide', new ScriptedState(Decision::pop())));

        $answer = $stack->answer($this->stop());

        $this->assertSame(['guide delegate pop_self', 'ready allow keep'], $this->stepsOf($answer));
        $this->assertSame(['ready'], $answer->stack->frameIds());
        $this->assertSame(['ready', 'guide'], $stack->frameIds());
    }

    public function test_the_bottom_state_cannot_finish(): void
    {
        $bottom = $this->ready();
        $stack = $this->stack($bottom);

        $this->expectException(BottomStateCannotFinish::class);

        $stack->withoutFrame($bottom);
    }

    public function test_a_finished_bottom_state_is_refused_at_cleanup(): void
    {
        $stack = $this->stack(new Frame('ready', $this->reference('ready'), new ScriptedState(Decision::allow(), finished: true), bottom: true));

        $this->expectException(BottomStateCannotFinish::class);

        $stack->withoutFinishedFrames();
    }

    public function test_a_bottom_state_that_delegates_fails_with_the_steps_it_took(): void
    {
        $delegatingBottom = new class extends Ready
        {
            public function onStop(StopRequested $input): Decision
            {
                return Decision::delegate();
            }
        };
        $stack = $this->stack(
            new Frame('ready', $this->reference('ready'), $delegatingBottom, bottom: true),
            $this->frame('top', ScriptedState::delegating()),
        );

        try {
            $stack->answer($this->stop());
            $this->fail('The delegating bottom state was not refused.');
        } catch (BottomStateDelegated $failure) {
            $this->assertSame(['top', 'ready'], $failure->visitedFrames);
        }
    }

    public function test_a_stack_without_states_has_no_bottom(): void
    {
        $this->expectException(MissingBottomState::class);

        $this->stack()->answer($this->stop());
    }

    public function test_an_activity_may_not_allow(): void
    {
        $stack = $this->stack($this->ready(), $this->frame('top', new ScriptedState(Decision::allow())));

        $this->expectException(ActivityAllowed::class);

        $stack->answer($this->stop());
    }

    public function test_a_hook_refuses_an_answer_it_cannot_take(): void
    {
        $stack = $this->stack($this->ready(), $this->frame('top', new ScriptedState(Decision::preventStop('Not yet.'))));

        $this->expectException(InvalidHookAnswer::class);

        $stack->answer(HookInputs::all()['prompt']);
    }

    public function test_pushing_a_state_already_on_the_stack_changes_nothing(): void
    {
        $stack = $this->exampleStack(TaskWorkState::Active, MessageWorkState::Unanswered);

        $this->assertSame($stack, $stack->withStateOnTop($this->reference('tasks.working', 42)));
        $this->assertSame(['ready', 'task-42', 'message-95'], $stack->frameIds());
    }

    public function test_the_top_may_push_and_deny_in_one_answer_and_the_child_answers_the_next_hook(): void
    {
        $child = new ScriptedState(Decision::deny('The guide answers now.'));
        $factory = new InMemoryStateFactory(['guide' => fn () => $child]);
        $pushAndDeny = Decision::deny('Read the guide first.')->withPush($this->reference('guide'));
        $stack = new AgentStack([$this->ready(), $this->frame('top', new ScriptedState($pushAndDeny))], $factory);

        $first = $stack->answer(HookInputs::all()['prompt']);

        $this->assertSame(['top deny push'], $this->stepsOf($first));
        $this->assertSame(['ready', 'top', 'pushed-1'], $first->stack->frameIds());
        $this->assertSame(['ready', 'top'], $stack->frameIds());
        $this->assertSame(0, $child->askedCount);

        $second = $first->stack->answer(HookInputs::all()['prompt']);

        $this->assertSame(['pushed-1 deny keep'], $this->stepsOf($second));
        $this->assertSame(1, $child->askedCount);
    }

    public function test_a_covered_state_may_not_push_even_after_the_top_popped(): void
    {
        $factory = new InMemoryStateFactory(['guide' => fn () => ScriptedState::delegating()]);
        $stack = new AgentStack([
            $this->ready(),
            $this->frame('covered', new ScriptedState(Decision::push($this->reference('guide')))),
            $this->frame('top', new ScriptedState(Decision::pop())),
        ], $factory);

        $this->expectException(CoveredStatePushed::class);

        $stack->answer($this->stop());
    }

    public function test_cleanup_removes_a_finished_state_from_the_middle(): void
    {
        $stack = $this->exampleStack(TaskWorkState::Finished, MessageWorkState::Unanswered);

        $this->assertSame(['ready', 'message-95'], $stack->withoutFinishedFrames()->frameIds());
        $this->assertSame(['ready', 'task-42', 'message-95'], $stack->frameIds());
    }

    public function test_the_records_list_every_frame_bottom_first(): void
    {
        $records = $this->exampleStack(TaskWorkState::Active, MessageWorkState::Unanswered)->records()->all();

        $this->assertSame(['ready', 'task-42', 'message-95'], array_map(fn ($record) => $record->id, $records));
        $this->assertSame([true, false, false], array_map(fn ($record) => $record->isBottom, $records));
        $this->assertTrue($records[1]->reference->isSameAs($this->reference('tasks.working', 42)));
    }

    public function test_a_step_keeps_its_typed_labels_through_an_array(): void
    {
        $step = new WalkStep('top', 'guide', 'onStop', AnswerKind::PreventStop, ChangeKind::Push);

        $copy = WalkStep::from($step->toArray());

        $this->assertSame(AnswerKind::PreventStop, $copy->answer);
        $this->assertSame(ChangeKind::Push, $copy->change);
        $this->assertSame($step->toArray(), $copy->toArray());
    }

    private function exampleStack(TaskWorkState $taskState, MessageWorkState $messageState): AgentStack
    {
        return $this->stack(
            $this->ready(),
            new Frame('task-42', $this->reference('tasks.working', 42), new WorkingOnTask(new TaskWork(42, 1, $taskState))),
            new Frame('message-95', $this->reference('chat.answering', 95), new AnsweringMessage(new MessageWork(95, $messageState))),
        );
    }

    private function stack(Frame ...$frames): AgentStack
    {
        return new AgentStack(array_values($frames), new InMemoryStateFactory);
    }

    private function ready(): Frame
    {
        return new Frame('ready', $this->reference('ready'), new Ready, bottom: true);
    }

    private function frame(string $id, AgentState $state): Frame
    {
        return new Frame($id, $this->reference($id), $state);
    }

    private function reference(string $typeKey, ?int $subjectId = null): StateReference
    {
        if ($subjectId === null) {
            return new StateReference($typeKey, NoSubject::None);
        }

        return new StateReference($typeKey, new SubjectReference($subjectId, 1));
    }

    private function stop(): StopRequested
    {
        $stop = HookInputs::all()['stop'];
        $this->assertInstanceOf(StopRequested::class, $stop);

        return $stop;
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
