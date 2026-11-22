<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Enums\AccessRuleType;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\StackTarget;
use App\Communication\States\AnsweringMessageState;
use App\Hooks\Contracts\OperationPolicy;
use App\Hooks\Decisions\ContextLine;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\MessageLine;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Exceptions\BottomStateCannotFinish;
use App\Hooks\Exceptions\HookAnswerRefused;
use App\Hooks\Exceptions\InvalidHookAnswer;
use App\Hooks\Exceptions\MissingBottomState;
use App\Hooks\Exceptions\StackTooDeep;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\References\StateReference;
use App\Hooks\References\SubjectReference;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\Frames\Frame;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\States\AgentState;
use App\Hooks\States\ReadyState;
use App\Hooks\Storage\WalkStep;
use App\Records\Commands\UnlinkRecords;
use App\Skills\Enums\PublicationState;
use App\Skills\States\AwaitingSkillsState;
use Carbon\CarbonImmutable;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\States\FollowingSequenceState;
use Domain\Sequences\Support\SequenceWork;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Fixtures\Hooks\ShellAnswerState;
use Tests\Fixtures\Hooks\StopAnswerState;
use Tests\Fixtures\Hooks\SwitchableState;
use Tests\Support\TestActors;
use Tests\TestCase;

final class AgentStackTest extends TestCase
{
    public function test_the_top_denial_answers_a_stop_and_no_state_below_it_is_asked(): void
    {
        $stop = $this->stop();
        $both = $this->exampleStack(TaskState::Started, messageWaits: true);

        $this->assertSame(['message-95 deny'], $this->stepsOf($both->answer($stop)));

        $answered = $this->exampleStack(TaskState::Started, messageWaits: false)->withoutExposedInactive();

        $this->assertSame(['ready', 'task-42'], $answered->frameIds());
        $this->assertSame(['task-42 deny'], $this->stepsOf($answered->answer($stop)));

        $done = $this->exampleStack(TaskState::Finished, messageWaits: false)->withoutExposedInactive();
        $answer = $done->answer($stop);

        $this->assertTrue($answer->isAllowed());
        $this->assertSame(['ready delegate'], $this->stepsOf($answer));
    }

    public function test_a_shell_write_is_refused_by_the_message_and_the_task_is_not_asked(): void
    {
        $answer = $this->exampleStack(TaskState::Started, messageWaits: true)
            ->answer(HookInputs::all()['shell command']);

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(['message-95 deny'], $this->stepsOf($answer));
    }

    public function test_a_pushed_sequence_answers_the_next_stop_before_the_task(): void
    {
        $factory = new InMemoryStateFactory([
            'sequences.following' => fn () => new FollowingSequenceState(
                new SequenceWork(8, 3, 'Run the phase tests.', SequenceRunState::Running),
            ),
        ]);
        $stack = new AgentStack([
            $this->ready(),
            new Frame(
                'task-42',
                $this->reference('tasks.working', '42'),
                new WorkingOnTaskState(new TaskWork(42, 1, TaskState::Started)),
                CarbonImmutable::now(),
            ),
        ], $factory, new StackTarget('agent-1', 'session-1'));

        $stack = $stack->withStateOnTop($this->reference('sequences.following', '8'));
        $answer = $stack->answer($this->stop());

        $this->assertSame(['ready', 'task-42', 'pushed-1'], $stack->frameIds());
        $this->assertSame(['pushed-1 deny'], $this->stepsOf($answer));
        $this->assertSame($answer->steps[0]->denialReason, $answer->decision->refusalReason());
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_states_that_pass_let_every_state_below_answer_and_the_hook_is_allowed(HookInput $input): void
    {
        $top = ScriptedState::passing();
        $middle = ScriptedState::passing();
        $stack = $this->stack($this->ready(), $this->frame('middle', $middle), $this->frame('top', $top));

        $answer = $stack->answer($input);

        $this->assertSame(['top delegate', 'middle delegate', 'ready delegate'], $this->stepsOf($answer));
        $this->assertTrue($answer->isAllowed());
        $this->assertSame([1, 1], [$top->askedCount, $middle->askedCount]);
        $this->assertSame($input->methodName(), $answer->steps[0]->hookMethod);
    }

    public function test_file_policy_and_pending_skill_guards_are_enforced_under_a_state_that_passes(): void
    {
        $passing = $this->frame('guide', ScriptedState::passing());
        $stack = $this->stack($this->ready(mayChangeFiles: false), $passing);

        $file = $stack->answer(HookInputs::all()['file edit']);

        $this->assertSame(['guide delegate', 'ready deny'], $this->stepsOf($file));

        $pending = $this->frame('skills', new AwaitingSkillsState(PublicationState::Pending));
        $guarded = $this->stack($this->ready(), $pending, $passing);

        $this->assertSame(['guide delegate', 'skills deny'], $this->stepsOf($guarded->answer(HookInputs::all()['shell command'])));
        $this->assertSame(['guide delegate', 'skills deny'], $this->stepsOf($guarded->answer(HookInputs::all()['file edit'])));
    }

    public function test_a_tool_handler_that_passes_cannot_hide_the_operation_policy(): void
    {
        $refusal = AccessDecision::refused(AccessRuleType::NotGranted, 'Tool refused.');
        $policy = $this->createStub(OperationPolicy::class);
        $policy->method('assess')->willReturn($refusal);
        $ready = new Frame(
            'ready',
            $this->reference('ready'),
            new ReadyState($policy, new AllowedStops()),
            CarbonImmutable::now(),
            bottom: true,
        );
        $stack = $this->stack($ready, $this->frame('guide', ScriptedState::passing()));

        $answer = $stack->answer(HookInputs::all()['tool requested']);

        $this->assertSame($refusal->reason, $answer->decision->refusalReason());
        $this->assertSame(['guide delegate', 'ready deny'], $this->stepsOf($answer));
    }

    public function test_hidden_message_and_sequence_guards_add_no_context_of_their_own_during_the_walk(): void
    {
        $work = new SequenceWork(8, 3, 'Run the phase tests.', SequenceRunState::Running);
        $stack = $this->stack(
            $this->ready(),
            $this->frame('sequence', new FollowingSequenceState($work)),
            $this->answeringFrame(true),
            $this->frame('guide', ScriptedState::passing()),
        );

        $this->assertSame([], $stack->answer(HookInputs::all()['session start'])->context);
        $this->assertSame([], $stack->answer(HookInputs::all()['compaction'])->context);
    }

    public function test_no_state_below_a_denial_is_asked(): void
    {
        $below = ScriptedState::passing();
        $stack = $this->stack(
            $this->ready(),
            $this->frame('below', $below),
            $this->frame('top', new ScriptedState(Decision::deny('Not now.'))),
        );

        $answer = $stack->answer(HookInputs::all()['prompt']);

        $this->assertSame(['top deny'], $this->stepsOf($answer));
        $this->assertSame(0, $below->askedCount);
    }

    public function test_lines_are_collected_from_the_top_down_and_messages_among_them_are_kept(): void
    {
        $middle = new ContextLine('From the middle.');
        $top = new MessageLine('From the top.');
        $stack = $this->stack(
            $this->ready(),
            $this->frame('middle', new StopAnswerState($middle)),
            $this->frame('top', new StopAnswerState($top)),
        );

        $answer = $stack->answer($this->stop());

        $this->assertSame([$top->text, $middle->text], $answer->context);
        $this->assertSame([$top->text], $answer->messages);
        $this->assertSame([1, 1, 0], array_column($answer->steps, 'contextCount'));
    }

    public function test_the_first_denial_answers_with_the_lines_yielded_above_and_before_it(): void
    {
        $above = new ContextLine('Above.');
        $before = new MessageLine('Before the denial.');
        $denial = Decision::deny('First denial.');
        $below = ScriptedState::passing();
        $stack = $this->stack(
            $this->ready(),
            $this->frame('below', $below),
            $this->frame('denier', new StopAnswerState([$before, $denial])),
            $this->frame('top', new StopAnswerState($above)),
        );

        $answer = $stack->answer($this->stop());

        $this->assertSame($denial, $answer->decision);
        $this->assertSame([$above->text, $before->text], $answer->context);
        $this->assertSame([$before->text], $answer->messages);
        $this->assertSame(['top delegate', 'denier deny'], $this->stepsOf($answer));
        $this->assertSame([null, $denial->refusalReason()], array_column($answer->steps, 'denialReason'));
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

        $answer = $stack->answer(HookInputs::all()['shell command']);

        $this->assertSame($highest, $answer->decision);
        $this->assertSame(['top rewrite', 'lower rewrite', 'ready delegate'], $this->stepsOf($answer));
    }

    public function test_commands_and_events_are_gathered_in_order_from_the_states_asked(): void
    {
        $first = new UnlinkRecords(TestActors::record('tasks.task', 1), TestActors::record('tasks.task', 2));
        $event = new TaskClosed(5);
        $second = new UnlinkRecords(TestActors::record('tasks.task', 3), TestActors::record('tasks.task', 4));
        $stack = $this->stack(
            $this->ready(),
            $this->frame('below', new StopAnswerState($second)),
            $this->frame('top', new StopAnswerState((function () use ($first, $event) {
                yield $first;

                yield $event;
            })())),
        );

        $this->assertSame([$first, $event, $second], $stack->answer($this->stop())->effects);
    }

    /**
     * @return array<string, array{mixed}>
     */
    public static function refusedAnswers(): array
    {
        return [
            'an allow' => [Decision::allow()],
            'a yield after the decision' => [[Decision::deny('Held.'), new ContextLine('Too late.')]],
            'something that is no answer' => [3],
        ];
    }

    #[DataProvider('refusedAnswers')]
    public function test_an_answer_a_state_may_not_give_is_refused(mixed $answer): void
    {
        $stack = $this->stack($this->ready(), $this->frame('top', new StopAnswerState($answer)));

        $this->expectException(HookAnswerRefused::class);

        $stack->answer($this->stop());
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
        $bottom = new ScriptedState(null, finished: true);
        $stack = $this->stack(
            new Frame('ready', $this->reference('ready'), $bottom, CarbonImmutable::now(), bottom: true),
        );

        $this->assertSame(['ready'], $stack->withoutExposedInactive()->frameIds());
    }

    public function test_a_stack_without_states_has_no_bottom(): void
    {
        $this->expectException(MissingBottomState::class);

        $this->stack()->answer($this->stop());
    }

    public function test_a_hook_refuses_a_decision_it_cannot_take(): void
    {
        $stack = $this->stack($this->ready(), $this->frame('top', new ScriptedState(Decision::rewrite('ls'))));

        $this->expectException(InvalidHookAnswer::class);

        $stack->answer(HookInputs::all()['prompt']);
    }

    public function test_pushing_a_state_already_on_the_stack_changes_nothing(): void
    {
        $stack = $this->exampleStack(TaskState::Started, messageWaits: true);

        $this->assertSame($stack, $stack->withStateOnTop($this->reference('tasks.working', '42')));
        $this->assertSame(['ready', 'task-42', 'message-95'], $stack->frameIds());
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
    public function test_a_finished_state_is_never_asked(HookInput $input): void
    {
        $stack = $this->exampleStack(TaskState::Finished, messageWaits: false);

        $this->assertSame(['ready'], array_map(fn (WalkStep $step) => $step->frameId, $stack->answer($input)->steps));
    }

    public function test_a_finished_state_in_the_middle_stays_buried_when_the_top_is_popped(): void
    {
        $stack = $this->exampleStack(TaskState::Finished, messageWaits: true);

        $this->assertSame(['ready', 'task-42', 'message-95'], $stack->withoutExposedInactive()->frameIds());
        $this->assertSame(['ready'], $stack->poppedOf($stack->frames()[2])->frameIds());
    }

    public function test_the_records_list_every_frame_bottom_first(): void
    {
        $records = $this->exampleStack(TaskState::Started, messageWaits: true)->records()->all();

        $this->assertSame(['ready', 'task-42', 'message-95'], array_map(fn ($record) => $record->id, $records));
        $this->assertSame([true, false, false], array_map(fn ($record) => $record->isBottom, $records));
        $this->assertTrue($records[1]->reference->isSameAs($this->reference('tasks.working', '42')));
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
        $task = new WorkingOnTaskState(new TaskWork(42, 1, TaskState::Started));
        $stack = $this->stack(
            $this->ready(),
            $this->answeringFrame(true),
            new Frame('task-42', $this->reference('tasks.working', '42'), $task, CarbonImmutable::now()),
            $this->frame('guide', ScriptedState::passing()),
        );

        $this->assertSame($task->instruction()->get(), $stack->instruction()->get());
        $this->assertTrue($this->stack($this->ready())->instruction()->isEmpty());
    }

    public function test_a_switched_off_top_frame_is_not_asked_and_the_frames_beneath_answer(): void
    {
        $switchedOff = new SwitchableState(false);
        $stack = $this->stack(
            $this->ready(),
            new Frame(
                'task-42',
                $this->reference('tasks.working', '42'),
                new WorkingOnTaskState(new TaskWork(42, 1, TaskState::Started)),
                CarbonImmutable::now(),
            ),
            $this->frame('review', $switchedOff),
        );

        $this->assertSame(['task-42 deny'], $this->stepsOf($stack->answer($this->stop())));
        $this->assertSame(['ready', 'task-42', 'review'], $stack->frameIds());
    }

    public function test_only_the_inactive_frames_exposed_at_the_top_are_popped(): void
    {
        $stack = $this->stack(
            $this->ready(),
            $this->frame('review', new SwitchableState(false)),
            new Frame(
                'task-42',
                $this->reference('tasks.working', '42'),
                new WorkingOnTaskState(new TaskWork(42, 1, TaskState::Started)),
                CarbonImmutable::now(),
            ),
            $this->frame('notes', new SwitchableState(true)),
            $this->answeringFrame(false),
        );

        $this->assertSame(['ready', 'review', 'task-42', 'notes'], $stack->withoutExposedInactive()->frameIds());
    }

    private function exampleStack(TaskState $taskState, bool $messageWaits): AgentStack
    {
        return $this->stack(
            $this->ready(),
            new Frame(
                'task-42',
                $this->reference('tasks.working', '42'),
                new WorkingOnTaskState(new TaskWork(42, 1, $taskState)),
                CarbonImmutable::now(),
            ),
            $this->answeringFrame($messageWaits),
        );
    }

    private function stack(Frame ...$frames): AgentStack
    {
        return new AgentStack(array_values($frames), new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1'));
    }

    private function ready(bool $mayChangeFiles = true): Frame
    {
        return new Frame(
            'ready',
            $this->reference('ready'),
            new ReadyState(new FixedOperationPolicy($mayChangeFiles), new AllowedStops()),
            CarbonImmutable::now(),
            bottom: true,
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

        return new StateReference($typeKey, new SubjectReference((string) $subjectId, 1));
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
            fn (WalkStep $step) => "{$step->frameId} {$step->answer->value}",
            $answer->steps,
        );
    }

    private function answeringFrame(bool $messageWaits): Frame
    {
        $reference = $this->reference('communication.answering', '95');

        return new Frame(
            'message-95',
            $reference,
            new AnsweringMessageState('95', $messageWaits),
            CarbonImmutable::now(),
        );
    }
}
