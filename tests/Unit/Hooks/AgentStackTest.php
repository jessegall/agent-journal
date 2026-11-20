<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Enums\AccessRuleType;
use App\Agents\Values\AccessDecision;
use App\Communication\States\AnsweringMessageState;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Contracts\OperationPolicy;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\SelectionReason;
use App\Hooks\Enums\TransitionType;
use App\Hooks\Exceptions\BottomStateCannotFinish;
use App\Hooks\Exceptions\BottomStateDelegated;
use App\Hooks\Exceptions\InvalidHookAnswer;
use App\Hooks\Exceptions\MissingBottomState;
use App\Hooks\Exceptions\StateBelowTopPushed;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolRequested;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\Frame;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\States\AgentState;
use App\Hooks\States\ReadyState;
use App\Hooks\Storage\WalkStep;
use App\Skills\Enums\PublicationState;
use App\Skills\States\AwaitingSkillsState;
use Carbon\CarbonImmutable;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\States\FollowingSequenceState;
use Domain\Sequences\Support\SequenceWork;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\MarkedStopState;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Fixtures\Hooks\SwitchableState;
use Tests\TestCase;

final class AgentStackTest extends TestCase
{
    public function test_live_task_and_message_obligations_both_answer_a_stop(): void
    {
        $stop = $this->stop();
        $both = $this->exampleStack(TaskWorkState::Active, messageWaits: true);

        $this->assertSame(
            ['message-95 deny keep', 'task-42 deny keep'],
            $this->stepsOf($both->answer($stop)),
        );

        $answered = $this->exampleStack(TaskWorkState::Active, messageWaits: false)->withoutExposedInactive();

        $this->assertSame(['ready', 'task-42'], $answered->frameIds());
        $this->assertSame(['task-42 deny keep'], $this->stepsOf($answered->answer($stop)));

        $done = $this->exampleStack(TaskWorkState::Finished, messageWaits: false)->withoutExposedInactive();
        $answer = $done->answer($stop);

        $this->assertSame(AnswerType::Allow, $answer->decision->answerType());
        $this->assertSame(['ready allow keep'], $this->stepsOf($answer));
    }

    public function test_a_shell_write_is_refused_by_the_message_and_the_task_is_not_asked(): void
    {
        $answer = $this->exampleStack(TaskWorkState::Active, messageWaits: true)
            ->answer(HookInputs::all()['shell command']);

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(['message-95 deny keep'], $this->stepsOf($answer));
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
                new WorkingOnTaskState(new TaskWork(42, 1, TaskWorkState::Active)),
                CarbonImmutable::now(),
            ),
        ], $factory);

        $stack = $stack->withStateOnTop($this->reference('sequences.following', '8'));
        $answer = $stack->answer($this->stop());

        $this->assertSame(['ready', 'task-42', 'pushed-1'], $stack->frameIds());
        $this->assertSame(['pushed-1 deny keep', 'task-42 deny keep'], $this->stepsOf($answer));
        $this->assertStringContainsString('step 3', (string) $answer->steps[0]->denialReason);
        $this->assertStringContainsString('Task 42 still needs work', $answer->decision->refusalReason());
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_a_delegating_match_shadows_ordinary_methods_below_it(HookInput $input): void
    {
        $top = ScriptedState::delegating();
        $middle = ScriptedState::delegating();
        $stack = $this->stack($this->ready(), $this->frame('middle', $middle), $this->frame('top', $top));

        $answer = $stack->answer($input);

        $expected = $input instanceof FileEditRequested || $input instanceof ToolRequested
            ? ['top delegate keep', 'ready allow keep']
            : ['top delegate keep'];
        $this->assertSame($expected, $this->stepsOf($answer));
        $this->assertTrue($answer->isAllowed());
        $this->assertSame([1, 0], [$top->askedCount, $middle->askedCount]);
        $this->assertSame($input->methodName(), $answer->steps[0]->hookMethod);
    }

    public function test_file_policy_and_pending_skill_guards_are_enforced_under_a_matching_allow(): void
    {
        $allowed = $this->frame('guide', new ScriptedState(Decision::allow()));
        $stack = $this->stack($this->ready(mayChangeFiles: false), $allowed);

        $file = $stack->answer(HookInputs::all()['file edit']);

        $this->assertStringContainsString('grants no changes to workspace files', $file->decision->refusalReason());
        $this->assertSame(['guide allow keep', 'ready deny keep'], $this->stepsOf($file));

        $pending = $this->frame('skills', new AwaitingSkillsState(PublicationState::Pending));
        $guarded = $this->stack($this->ready(), $pending, $allowed);
        $shell = $guarded->answer(HookInputs::all()['shell command']);
        $edit = $guarded->answer(HookInputs::all()['file edit']);

        $this->assertSame(['guide allow keep', 'skills deny keep'], $this->stepsOf($shell));
        $this->assertSame(['guide allow keep', 'skills deny keep', 'ready allow keep'], $this->stepsOf($edit));
    }

    public function test_a_matching_tool_handler_cannot_hide_the_operation_policy(): void
    {
        $policy = $this->createStub(OperationPolicy::class);
        $policy->method('assess')->willReturn(AccessDecision::refused(AccessRuleType::NotGranted, 'Tool refused.'));
        $ready = new Frame(
            'ready',
            $this->reference('ready'),
            new ReadyState($policy),
            CarbonImmutable::now(),
            bottom: true,
        );
        $stack = $this->stack($ready, $this->frame('guide', ScriptedState::delegating()));

        $answer = $stack->answer(HookInputs::all()['tool requested']);

        $this->assertSame('Tool refused.', $answer->decision->refusalReason());
        $this->assertSame(['guide delegate keep', 'ready deny keep'], $this->stepsOf($answer));
    }

    public function test_hidden_message_and_sequence_guards_keep_their_observation_context(): void
    {
        $top = $this->frame('guide', new ScriptedState(Decision::allow()));
        $work = new SequenceWork(8, 3, 'Run the phase tests.', SequenceRunState::Running);
        $sequence = new FollowingSequenceState($work);
        $stack = $this->stack($this->ready(), $this->frame('sequence', $sequence), $this->answeringFrame(true), $top);

        $session = $stack->answer(HookInputs::all()['session start']);
        $compaction = $stack->answer(HookInputs::all()['compaction']);

        $this->assertSame(['guide allow keep', 'message-95 delegate keep'], $this->stepsOf($session));
        $this->assertStringContainsString('reply to it before other work', $session->context[0]);
        $this->assertSame(['guide allow keep', 'sequence delegate keep'], $this->stepsOf($compaction));
        $this->assertStringContainsString('Run the phase tests.', $compaction->context[0]);
    }

    public function test_no_state_below_the_answering_state_is_asked(): void
    {
        $below = ScriptedState::delegating();
        $stack = $this->stack(
            $this->ready(),
            $this->frame('below', $below),
            $this->frame('top', new ScriptedState(Decision::deny('Not now.'))),
        );

        $answer = $stack->answer(HookInputs::all()['prompt']);

        $this->assertSame(['top deny keep'], $this->stepsOf($answer));
        $this->assertSame(0, $below->askedCount);
    }

    public function test_context_is_collected_from_the_top_down(): void
    {
        $stack = $this->stack(
            $this->ready(),
            $this->frame('middle', new MarkedStopState(Decision::addContext('From the middle.'))),
            $this->frame('top', new ScriptedState(Decision::addContext('From the top.'))),
        );

        $this->assertSame(['From the top.', 'From the middle.'], $stack->answer($this->stop())->context);
    }

    public function test_a_delegating_pop_removes_its_origin_and_resolves_to_allow(): void
    {
        $stack = $this->stack($this->ready(), $this->frame('guide', new ScriptedState(Decision::pop())));

        $answer = $stack->answer($this->stop());

        $this->assertSame(['guide delegate pop_self'], $this->stepsOf($answer));
        $this->assertTrue($answer->isAllowed());
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

    public function test_a_finished_bottom_state_stays_when_the_exposed_frames_are_popped(): void
    {
        $bottom = new ScriptedState(Decision::allow(), finished: true);
        $stack = $this->stack(
            new Frame('ready', $this->reference('ready'), $bottom, CarbonImmutable::now(), bottom: true),
        );

        $this->assertSame(['ready'], $stack->withoutExposedInactive()->frameIds());
    }

    public function test_a_bottom_state_that_delegates_fails_with_the_steps_it_took(): void
    {
        $delegatingBottom = new class(new FixedOperationPolicy()) extends ReadyState
        {
            public function onStop(StopRequested $input): Decision
            {
                return Decision::delegate();
            }
        };
        $stack = $this->stack(
            new Frame('ready', $this->reference('ready'), $delegatingBottom, CarbonImmutable::now(), bottom: true),
            $this->frame('top', new SwitchableState(true)),
        );

        try {
            $stack->answer($this->stop());
            $this->fail('The delegating bottom state was not refused.');
        } catch (BottomStateDelegated $failure) {
            $this->assertSame(['ready'], $failure->visitedFrames);
        }
    }

    public function test_a_stack_without_states_has_no_bottom(): void
    {
        $this->expectException(MissingBottomState::class);

        $this->stack()->answer($this->stop());
    }

    public function test_a_non_bottom_handler_may_allow(): void
    {
        $stack = $this->stack($this->ready(), $this->frame('top', new ScriptedState(Decision::allow())));

        $this->assertTrue($stack->answer($this->stop())->isAllowed());
    }

    public function test_every_selected_answer_is_recorded_and_the_latest_denial_survives(): void
    {
        $firstDenial = Decision::deny('First denial.')->withMessage('Repeated.');
        $lateDenial = Decision::deny('Later denial.')->withContext('Later context.');
        $stack = $this->stack(
            $this->ready(),
            $this->frame('delegate', new MarkedStopState(Decision::message('Final context.'))),
            $this->frame('late-denial', new MarkedStopState($lateDenial)),
            $this->frame('allow', new MarkedStopState(Decision::allow()->withMessage('Repeated.'))),
            $this->frame('first-denial', new ScriptedState($firstDenial)),
        );

        $answer = $stack->answer($this->stop());

        $this->assertSame('Later denial.', $answer->decision->refusalReason());
        $this->assertSame(['Repeated.', 'Repeated.', 'Later context.', 'Final context.'], $answer->context);
        $this->assertSame(['Repeated.', 'Repeated.', 'Final context.'], $answer->messages);
        $this->assertSame(['First denial.', null, 'Later denial.', null], array_column($answer->steps, 'denialReason'));
        $this->assertSame(
            [
                SelectionReason::FirstMatch,
                SelectionReason::StackWide,
                SelectionReason::StackWide,
                SelectionReason::StackWide,
            ],
            array_column($answer->steps, 'selectionReason'),
        );
    }

    public function test_invalid_selected_answers_prevent_earlier_transitions_from_running(): void
    {
        $loaded = 0;
        $factory = new InMemoryStateFactory(['guide' => function () use (&$loaded): ScriptedState {
            $loaded++;

            return ScriptedState::delegating();
        }]);
        $stack = new AgentStack([
            $this->ready(),
            $this->frame('invalid', new MarkedStopState(Decision::rewrite('ls'))),
            $this->frame('top', new ScriptedState(Decision::allow()->withPush($this->reference('guide')))),
        ], $factory);

        try {
            $stack->answer($this->stop());
            $this->fail('The invalid selected step was accepted.');
        } catch (InvalidHookAnswer) {
            $this->assertSame(0, $loaded);
        }
    }

    public function test_a_lower_marked_pop_and_a_top_push_both_apply_to_their_origins(): void
    {
        $guide = ScriptedState::delegating();
        $stack = new AgentStack([
            $this->ready(),
            $this->frame('lower', new MarkedStopState(Decision::pop())),
            $this->frame('top', new ScriptedState(Decision::push($this->reference('guide')))),
        ], new InMemoryStateFactory(['guide' => fn () => $guide]));

        $answer = $stack->answer($this->stop());

        $this->assertSame(['top delegate push', 'lower delegate pop_self'], $this->stepsOf($answer));
        $this->assertSame(['ready', 'top', 'pushed-1'], $answer->stack->frameIds());
        $this->assertSame(0, $guide->askedCount);
    }

    public function test_a_hook_refuses_an_answer_it_cannot_take(): void
    {
        $stack = $this->stack($this->ready(), $this->frame('top', new ScriptedState(Decision::rewrite('ls'))));

        $this->expectException(InvalidHookAnswer::class);

        $stack->answer(HookInputs::all()['prompt']);
    }

    public function test_pushing_a_state_already_on_the_stack_changes_nothing(): void
    {
        $stack = $this->exampleStack(TaskWorkState::Active, messageWaits: true);

        $this->assertSame($stack, $stack->withStateOnTop($this->reference('tasks.working', '42')));
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
            $this->frame('covered', new MarkedStopState(Decision::push($this->reference('guide')))),
            $this->frame('top', new ScriptedState(Decision::pop())),
        ], $factory);

        $this->expectException(StateBelowTopPushed::class);

        $stack->answer($this->stop());
    }

    public function test_a_state_answers_from_before_without_its_hook_method(): void
    {
        $top = new ScriptedState(Decision::delegate(), beforeDecision: Decision::deny('Held by before.'));
        $stack = $this->stack($this->ready(), $this->frame('top', $top));

        $answer = $stack->answer(HookInputs::all()['shell command']);

        $this->assertSame(['top deny keep'], $this->stepsOf($answer));
        $this->assertSame(0, $top->askedCount);
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_a_finished_state_is_never_asked(HookInput $input): void
    {
        $stack = $this->exampleStack(TaskWorkState::Finished, messageWaits: false);

        $this->assertSame(['ready'], array_map(fn (WalkStep $step) => $step->frameId, $stack->answer($input)->steps));
    }

    public function test_a_finished_state_in_the_middle_stays_buried_when_the_top_is_popped(): void
    {
        $stack = $this->exampleStack(TaskWorkState::Finished, messageWaits: true);

        $this->assertSame(['ready', 'task-42', 'message-95'], $stack->withoutExposedInactive()->frameIds());
        $this->assertSame(['ready'], $stack->poppedOf($stack->frames()[2])->frameIds());
    }

    public function test_the_records_list_every_frame_bottom_first(): void
    {
        $records = $this->exampleStack(TaskWorkState::Active, messageWaits: true)->records()->all();

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
                'change' => TransitionType::Push,
                'contextCount' => 0,
            ],
        );

        $copy = WalkStep::from($step->toArray());

        $this->assertSame(AnswerType::Deny, $copy->answer);
        $this->assertSame(TransitionType::Push, $copy->transition);
        $this->assertSame($step->toArray(), $copy->toArray());
    }

    public function test_a_switched_off_top_frame_is_not_asked_and_the_frames_beneath_answer(): void
    {
        $switchedOff = new SwitchableState(false);
        $stack = $this->stack(
            $this->ready(),
            new Frame(
                'task-42',
                $this->reference('tasks.working', '42'),
                new WorkingOnTaskState(new TaskWork(42, 1, TaskWorkState::Active)),
                CarbonImmutable::now(),
            ),
            $this->frame('review', $switchedOff),
        );

        $this->assertSame(['task-42 deny keep'], $this->stepsOf($stack->answer($this->stop())));
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
                new WorkingOnTaskState(new TaskWork(42, 1, TaskWorkState::Active)),
                CarbonImmutable::now(),
            ),
            $this->frame('notes', new SwitchableState(true)),
            $this->answeringFrame(false),
        );

        $this->assertSame(['ready', 'review', 'task-42', 'notes'], $stack->withoutExposedInactive()->frameIds());
    }

    private function exampleStack(TaskWorkState $taskState, bool $messageWaits): AgentStack
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
        return new AgentStack(array_values($frames), new InMemoryStateFactory());
    }

    private function ready(bool $mayChangeFiles = true): Frame
    {
        return new Frame(
            'ready',
            $this->reference('ready'),
            new ReadyState(new FixedOperationPolicy($mayChangeFiles)),
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
            fn (WalkStep $step) => "{$step->frameId} {$step->answer->value} {$step->transition->value}",
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
