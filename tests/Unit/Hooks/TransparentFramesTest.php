<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Values\StackTarget;
use App\Communication\States\AnsweringMessageState;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\Frame;
use App\Hooks\States\AgentState;
use App\Hooks\States\ReadyState;
use App\Hooks\Storage\WalkStep;
use App\Processes\Enums\CommandEffect;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\CommandPart;
use App\Processes\Values\ShellCommand;
use Carbon\CarbonImmutable;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\States\WorkingOnPlanState;
use Domain\Plans\Support\PlanWork;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\TestCase;

/**
 * The worked walks and pops of doc 48 revision 4, sections 14 and 15: a finished frame stays stored and a walk passes
 * over it; only an explicit transition removes frames, and then only the exposed inactive ones.
 */
final class TransparentFramesTest extends TestCase
{
    public function test_a_finished_top_is_passed_over_and_the_plan_below_is_the_top(): void
    {
        $stack = $this->stack($this->ready(), $this->plan(), $this->task(finished: true));

        $answer = $stack->answer($this->input('stop'));

        $this->assertSame(['ready'], $this->visited($answer->steps));
        $this->assertSame('plan', $stack->top()->id);
        $this->assertSame(['ready', 'plan', 'task'], $answer->stack->frameIds());
    }

    public function test_a_message_above_a_finished_task_denies_an_edit_and_lets_a_read_through(): void
    {
        $stack = $this->stack($this->ready(), $this->plan(), $this->task(finished: true), $this->message());

        $edit = $stack->answer($this->input('file edit'));
        $read = $stack->answer($this->readOnlyShellLine());

        $this->assertSame(['message', 'ready'], $this->visited($edit->steps));
        $this->assertSame(['message'], $this->visited($read->steps));
        $this->assertSame('message', $stack->top()->id);
        $this->assertSame(['ready', 'plan', 'task', 'message'], $read->stack->frameIds());
    }

    public function test_a_finished_message_between_a_live_task_and_the_plan_is_skipped(): void
    {
        $stack = $this->stack($this->ready(), $this->plan(), $this->message(answered: true), $this->task());

        $stop = $stack->answer($this->input('stop'));
        $edit = $stack->answer($this->input('file edit'));

        $this->assertSame(['task'], $this->visited($stop->steps));
        $this->assertSame(['ready'], $this->visited($edit->steps));
        $this->assertSame(['ready', 'plan', 'message', 'task'], $edit->stack->frameIds());
    }

    public function test_when_all_work_ended_ready_alone_answers_and_is_the_top(): void
    {
        $stack = $this->stack(
            $this->ready(),
            $this->plan(cancelled: true),
            $this->task(finished: true),
            $this->message(answered: true),
        );

        $this->assertSame(['ready'], $this->visited($stack->answer($this->input('stop'))->steps));
        $this->assertSame('ready', $stack->top()->id);
    }

    public function test_a_message_pop_takes_the_exposed_finished_task_and_resumes_the_plan(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(finished: true), $this->message());

        $after = $before->poppedOf($before->frames()[3]);

        $this->assertSame(['ready', 'plan'], $after->frameIds());
        $removed = array_map(fn (Frame $frame) => $frame->id, $before->framesMissingFrom($after));

        $this->assertSame(['task', 'message'], $removed);
        $this->assertSame('plan', $after->topResumedSince($before)?->id);
    }

    public function test_a_push_by_the_plan_takes_the_exposed_finished_task_and_resumes_nothing(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(finished: true));

        $after = $before->withoutExposedInactive()->withStateOnTop($this->reference('tasks.working', '42'));

        $this->assertSame(['ready', 'plan'], array_slice($after->frameIds(), 0, 2));
        $this->assertCount(3, $after->frames());
        $this->assertNull($after->topResumedSince($before));
    }

    public function test_the_explicit_top_pop_removes_the_finished_suffix_without_a_resume(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(finished: true));

        $after = $before->withoutExposedInactive();

        $this->assertSame(['ready', 'plan'], $after->frameIds());
        $this->assertNull($after->topResumedSince($before));
    }

    public function test_a_push_over_a_live_message_keeps_the_buried_finished_task(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(finished: true), $this->message());

        $after = $before->withoutExposedInactive()->withStateOnTop($this->reference('tasks.working', '42'));

        $this->assertSame(['ready', 'plan', 'task', 'message'], array_slice($after->frameIds(), 0, 4));
    }

    public function test_a_plan_popping_itself_under_a_live_message_resumes_nothing(): void
    {
        $before = $this->stack($this->ready(), $this->plan(), $this->task(finished: true), $this->message());

        $after = $before->poppedOf($before->frames()[1]);

        $this->assertSame(['ready', 'task', 'message'], $after->frameIds());
        $this->assertNull($after->topResumedSince($before));
    }

    private function stack(Frame ...$frames): AgentStack
    {
        $pushed = fn (): AgentState => new WorkingOnTaskState(new TaskWork(42, 1, TaskState::Started));

        return new AgentStack(array_values($frames), new InMemoryStateFactory(['tasks.working' => $pushed]), new StackTarget('agent-1', 'session-1'));
    }

    private function ready(): Frame
    {
        return new Frame(
            'ready',
            $this->reference('ready'),
            new ReadyState(new FixedOperationPolicy(), new AllowedStops()),
            CarbonImmutable::now(),
            bottom: true,
        );
    }

    private function plan(bool $cancelled = false): Frame
    {
        $state = new WorkingOnPlanState(new PlanWork('plan-1', 1, $cancelled ? PlanState::Cancelled : PlanState::Started), PlanProgress::none(...));

        return $this->frame('plan', 'plans.working', '12', $state);
    }

    private function task(bool $finished = false): Frame
    {
        $work = new TaskWork(41, 3, $finished ? TaskState::Finished : TaskState::Started);

        return $this->frame('task', 'tasks.working', '41', new WorkingOnTaskState($work));
    }

    private function message(bool $answered = false): Frame
    {
        return $this->frame('message', 'communication.answering', '9', new AnsweringMessageState('9', ! $answered));
    }

    private function frame(string $id, string $typeKey, string $subjectId, AgentState $state): Frame
    {
        return new Frame($id, $this->reference($typeKey, $subjectId), $state, CarbonImmutable::now());
    }

    private function reference(string $typeKey, string|null $subjectId = null): StateReference
    {
        $subject = $subjectId === null ? NoSubject::None : new SubjectReference($subjectId, 1);

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
