<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Values\CommandPart;
use App\CommandRules\Enums\CommandEffect;
use App\CommandRules\Enums\CommandType;
use App\CommandRules\Enums\ParseOutcome;
use App\Engine\Enums\NoSubject;
use App\Engine\Enums\StackMoment;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\ShellDialect;
use App\Stacks\AgentStack;
use App\Stacks\AgentState;
use App\Stacks\FrameMoment;
use App\Stacks\Frames\Frame;
use App\Stacks\ReadyState;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Storage\WalkStep;
use App\Values\ShellCommand;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Hooks\AnswerStates;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Fixtures\Hooks\InMemoryTasks;
use Tests\Fixtures\Hooks\InMemoryTaskState;
use Tests\Fixtures\Hooks\Stacks\FinishableState;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;
use Tests\Fixtures\Hooks\SubjectIds;
use Tests\Support\DomainBoot;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * The worked walks and pops of the stack: a finished frame stays stored and a walk passes
 * over it; only an explicit transition removes frames, and then only the exposed inactive ones.
 */
final class TransparentFramesTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_finished_top_is_passed_over_and_the_plan_below_is_the_top(): void
    {
        $stack = $this->stack($this->ready(), $this->plan(), $this->task(hasFinished: true));

        $answer = $stack->answer($this->input('stop'), TestText::renderer());

        $this->assertSame(['ready'], $this->visited($answer->steps));
        $this->assertSame('plan', $stack->top()->id);
        $this->assertSame(['ready', 'plan', 'task'], $answer->stack->frameIds());
    }

    public function test_a_message_above_a_finished_task_with_its_tool_uses_spent_denies_an_edit_and_lets_a_read_pass(): void
    {
        $stack = $this->stack($this->ready(), $this->plan(), $this->task(hasFinished: true), $this->message());

        $edit = $stack->answer($this->input('file edit'), TestText::renderer());
        $read = $stack->answer($this->readOnlyShellLine(), TestText::renderer());

        $this->assertSame(['message'], $this->visited($edit->steps));
        $this->assertSame(['message'], $this->visited($read->steps));
        $this->assertSame('message', $stack->top()->id);
        $this->assertSame(['ready', 'plan', 'task', 'message'], $read->stack->frameIds());
    }

    public function test_a_finished_message_between_a_live_task_and_the_plan_is_skipped(): void
    {
        $stack = $this->stack($this->ready(), $this->plan(), $this->message(isAnswered: true), $this->task());

        $stop = $stack->answer($this->input('stop'), TestText::renderer());
        $edit = $stack->answer($this->input('file edit'), TestText::renderer());

        $this->assertSame(['task'], $this->visited($stop->steps));
        $this->assertSame(['ready'], $this->visited($edit->steps));
        $this->assertSame(['ready', 'plan', 'message', 'task'], $edit->stack->frameIds());
    }

    public function test_when_all_work_ended_ready_alone_answers_and_is_the_top(): void
    {
        $stack = $this->stack(
            $this->ready(),
            $this->plan(isCancelled: true),
            $this->task(hasFinished: true),
            $this->message(isAnswered: true),
        );

        $this->assertSame(['ready'], $this->visited($stack->answer($this->input('stop'), TestText::renderer())->steps));
        $this->assertSame('ready', $stack->top()->id);
    }

    public function test_a_message_pop_takes_the_exposed_finished_task_and_resumes_the_plan(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(hasFinished: true), $this->message());

        $after = $before->poppedOf($before->frames()[3]);

        $this->assertSame(['ready', 'plan'], $after->frameIds());
        $removed = array_map(fn (Frame $frame) => $frame->id, $before->framesMissingFrom($after));

        $this->assertSame(['task', 'message'], $removed);
        $this->assertSame('plan', $after->topResumedSince($before)?->id);
    }

    public function test_a_push_by_the_plan_takes_the_exposed_finished_task_and_resumes_nothing(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(hasFinished: true));

        $after = $before->withoutExposedInactive()->withStateOnTop($this->reference('tasks.work', '42'));

        $this->assertSame(['ready', 'plan'], array_slice($after->frameIds(), 0, 2));
        $this->assertCount(3, $after->frames());
        $this->assertNull($after->topResumedSince($before));
    }

    public function test_the_explicit_top_pop_removes_the_finished_suffix_without_a_resume(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(hasFinished: true));

        $after = $before->withoutExposedInactive();

        $this->assertSame(['ready', 'plan'], $after->frameIds());
        $this->assertNull($after->topResumedSince($before));
    }

    public function test_a_push_over_a_live_message_keeps_the_buried_finished_task(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(hasFinished: true), $this->message());

        $after = $before->withoutExposedInactive()->withStateOnTop($this->reference('tasks.work', '42'));

        $this->assertSame(['ready', 'plan', 'task', 'message'], array_slice($after->frameIds(), 0, 4));
    }

    public function test_a_plan_popping_itself_under_a_live_message_resumes_nothing(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(hasFinished: true), $this->message());

        $after = $before->poppedOf($before->frames()[1]);

        $this->assertSame(['ready', 'task', 'message'], $after->frameIds());
        $this->assertNull($after->topResumedSince($before));
    }

    public function test_a_lift_brings_a_live_frame_on_top_with_its_values_and_leaves_a_stack_without_it_alone(): void
    {
        $stack = $this->stack($this->ready(), $this->task(), $this->plan());

        $lifted = $stack->withLiveFrameLifted($this->reference('tasks.work', '41'));
        $unchanged = $stack->withLiveFrameLifted($this->reference('tasks.work', '99'));

        $this->assertSame(['ready', 'plan', 'task'], $lifted->frameIds());
        $this->assertSame($stack->frames()[1], $lifted->top());
        $this->assertSame(['ready', 'task', 'plan'], $unchanged->frameIds());
    }

    public function test_a_change_reads_its_exits_entries_and_resumed_top_against_the_snapshot_before_it(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(), $this->message());
        $snapshot = $before->snapshot();
        $after = $before->poppedOf($before->frames()[3])->withoutFrame($before->frames()[2]);

        $moments = array_map(
            fn (FrameMoment $moment) => [$moment->frame->id, $moment->moment],
            $snapshot->momentsOf($after),
        );

        $this->assertSame(
            [['task', StackMoment::Exit], ['message', StackMoment::Exit], ['plan', StackMoment::Resume]],
            $moments,
        );
    }

    private function stack(Frame ...$frames): AgentStack
    {
        $pushed = fn (): AgentState => new InMemoryTaskState(42, 1, new InMemoryTasks([42]));

        return new AgentStack(
            array_values($frames),
            new InMemoryStateFactory(['tasks.work' => $pushed]),
            new StackTarget('agent-1', 'session-1'),
        );
    }

    private function ready(): Frame
    {
        return new Frame(
            'ready',
            $this->reference('ready'),
            new ReadyState(new FixedOperationPolicy(), 'agent', 'session'),
            CarbonImmutable::now(),
            isBottom: true,
        );
    }

    private function plan(bool $isCancelled = false): Frame
    {
        $plans = new FinishedSubjects();
        $plans->finished = $isCancelled ? ['plan'] : [];
        $state = new FinishableState('plan', $plans);

        return $this->frame('plan', 'plans.work', '12', $state);
    }

    private function task(bool $hasFinished = false): Frame
    {
        $tasks = new InMemoryTasks($hasFinished ? [] : [41]);

        return $this->frame('task', 'tasks.work', '41', new InMemoryTaskState(41, 3, $tasks));
    }

    private function message(bool $isAnswered = false): Frame
    {
        $state = $isAnswered ? AnswerStates::answered() : AnswerStates::holding('9');

        return $this->frame('message', 'core.messages.answer', '9', $state);
    }

    private function frame(string $id, string $typeKey, string $subjectId, AgentState $state): Frame
    {
        return new Frame($id, $this->reference($typeKey, $subjectId), $state, CarbonImmutable::now());
    }

    private function reference(string $typeKey, string|null $subjectId = null): StateReference
    {
        $subject = $subjectId === null ? NoSubject::None : new SubjectReference(SubjectIds::of($subjectId), 1);

        return new StateReference($typeKey, $subject);
    }

    private function input(string $name): HookInput
    {
        return HookInputs::all()[$name];
    }

    private function readOnlyShellLine(): ShellCommandRequested
    {
        $stop = HookInputs::all()['stop'];
        $part = new CommandPart('ls', [], CommandEffect::ReadsOnly, CommandType::Ordinary, PartJoin::End);
        $line = new ShellCommand('ls', ShellDialect::Bash, ParseOutcome::Complete, [$part]);

        return new ShellCommandRequested($stop->hook, $line);
    }

    /**
     * @param  list<WalkStep>  $steps
     * @return list<string>
     */
    private function visited(array $steps): array
    {
        return array_map(fn (WalkStep $step) => $step->frameId, $steps);
    }
}
