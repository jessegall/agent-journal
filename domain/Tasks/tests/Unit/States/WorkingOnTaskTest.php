<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Unit\States;

use App\Enums\AnswerType;
use App\Events\AssignmentsEnded;
use App\Support\ActorIdentity;
use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Events\TaskRunClaimed;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use Domain\Tasks\Support\States\WorkingOnTaskState;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\TestCase;

/**
 * The task state keeps its run open until it hears its own task finished, blocked or cancelled, and passes every
 * hook but the stop.
 */
final class WorkingOnTaskTest extends TestCase
{
    /**
     * @return iterable<string, array{HookInput}>
     */
    public static function otherHooks(): iterable
    {
        foreach (HookInputs::all() as $name => $input) {
            if (! $input instanceof StopRequested) {
                yield $name => [$input];
            }
        }
    }

    public function test_a_new_run_is_not_finished(): void
    {
        $this->assertFalse($this->working()->isFinished());
    }

    public function test_hearing_its_task_finished_blocked_or_cancelled_ends_the_run(): void
    {
        $finished = $this->working();
        $finished->onTaskFinished(new TaskFinished('task-42', TaskState::Started, 'history-1'));
        $blocked = $this->working();
        $blocked->onTaskBlocked(new TaskBlocked('task-42', TaskState::Started, 'history-1'));
        $cancelled = $this->working();
        $cancelled->onTaskCancelled(new TaskCancelled('task-42', TaskState::Started, 'history-1'));

        $this->assertTrue($finished->isFinished());
        $this->assertTrue($blocked->isFinished());
        $this->assertTrue($cancelled->isFinished());
    }

    public function test_another_tasks_end_leaves_the_run_open(): void
    {
        $working = $this->working();

        $working->onTaskFinished(new TaskFinished('task-43', TaskState::Started, 'history-1'));

        $this->assertFalse($working->isFinished());
    }

    public function test_a_stop_is_held_back_while_its_claim_holds_and_let_through_once_a_claim_assignment_ended(): void
    {
        $working = $this->working();
        $working->onTaskRunClaimed(new TaskRunClaimed('task-42', 1, $this->agent(), ['claim-1', 'seat-1', 'work-1']));

        $held = $this->stop($working);
        $working->onAssignmentsEnded(new AssignmentsEnded(['seat-1']));

        $this->assertSame([AnswerType::Deny, AnswerType::Delegate], [$held, $this->stop($working)]);
        $this->assertTrue($working->isFinished());
    }

    public function test_the_late_end_of_an_earlier_claim_leaves_a_resumed_run_held(): void
    {
        $working = $this->working();
        $working->onTaskRunClaimed(new TaskRunClaimed('task-42', 1, $this->agent(), ['claim-1', 'work-1']));
        $working->onTaskRunClaimed(new TaskRunClaimed('task-42', 1, $this->agent(), ['claim-2', 'work-1']));

        $working->onAssignmentsEnded(new AssignmentsEnded(['claim-1']));

        $this->assertSame(AnswerType::Deny, $this->stop($working));
    }

    public function test_a_newer_run_of_its_task_ends_the_older_run(): void
    {
        $working = $this->working();

        $working->onTaskRunClaimed(new TaskRunClaimed('task-42', 2, $this->agent(), ['claim-9']));

        $this->assertTrue($working->isFinished());
    }

    public function test_a_claim_another_agent_took_lets_the_stop_through(): void
    {
        $working = $this->working();
        $other = ActorIdentity::fromText('agent:01jd8x0g9m3qz6v4k2t7r5w1cz');

        $working->onTaskRunClaimed(new TaskRunClaimed('task-42', 1, $other, ['claim-3']));

        $this->assertSame(AnswerType::Delegate, $this->stop($working));
    }

    public function test_a_log_falls_due_after_the_tool_use_limit_and_a_log_on_its_task_starts_the_count_again(): void
    {
        $working = $this->working();
        $finished = HookInputs::all()['tool finished'];

        foreach (range(2, WorkingOnTaskState::LOG_DUE_AFTER) as $use) {
            $working->onToolFinished($finished);
        }

        $working->onTaskLogged(new TaskLogged('task-42', 'entry-1'));
        $afterLog = $working->onToolFinished($finished);

        foreach (range(3, WorkingOnTaskState::LOG_DUE_AFTER) as $use) {
            $working->onToolFinished($finished);
        }

        $this->assertEquals(Decision::delegate(), $afterLog);
        $this->assertEquals(LogDueStateReference::forTask('task-42', 42), $working->onToolFinished($finished));
    }

    #[DataProvider('otherHooks')]
    public function test_every_other_hook_is_passed(HookInput $input): void
    {
        $this->assertEquals(Decision::delegate(), $input->answerBy($this->working()));
    }

    private function working(): WorkingOnTaskState
    {
        return new WorkingOnTaskState('task-42', 42, 1);
    }

    private function agent(): ActorIdentity
    {
        $stop = HookInputs::all()['stop'];

        return ActorIdentity::fromText("agent:{$stop->hook->agentId}");
    }

    private function stop(WorkingOnTaskState $working): AnswerType
    {
        return HookInputs::all()['stop']->answerBy($working)->answerType();
    }
}
