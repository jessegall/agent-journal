<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Unit\States;

use App\Enums\Hooks\AnswerType;
use App\Events\Assignments\AssignmentsEnded;
use App\Support\ActorIdentity;
use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use Domain\Tasks\Commands\FocusTask\FocusTaskCommand;
use Domain\Tasks\Commands\UnfocusTask\UnfocusTaskCommand;
use Domain\Tasks\Events\TaskRunClaimed;
use Domain\Tasks\Support\States\WorkOnTaskState;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\TestCase;

/**
 * The task state keeps its run open until it hears its own task finished, blocked or cancelled, and passes every
 * hook but the stop.
 */
final class WorkOnTaskTest extends TestCase
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

    public function test_a_stop_is_held_back_while_its_claim_holds_and_let_through_once_a_claim_assignment_ended(): void
    {
        $working = $this->working();
        $working->onTaskRunClaimed(new TaskRunClaimed('task-42', 1, $this->agent(), [
            'claim-1',
            'seat-1',
            'work-1',
        ]));

        $held = $this->stop($working);
        $working->onAssignmentsEnded(new AssignmentsEnded(['seat-1']));

        $this->assertSame([
            AnswerType::Deny,
            AnswerType::Delegate,
        ], [
            $held,
            $this->stop($working),
        ]);
        $this->assertTrue($working->isFinished());
    }

    public function test_the_late_end_of_an_earlier_claim_leaves_a_resumed_run_held(): void
    {
        $working = $this->working();
        $working->onTaskRunClaimed(new TaskRunClaimed('task-42', 1, $this->agent(), [
            'claim-1',
            'work-1',
        ]));
        $working->onTaskRunClaimed(new TaskRunClaimed('task-42', 1, $this->agent(), [
            'claim-2',
            'work-1',
        ]));

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

    public function test_entering_or_resuming_focuses_its_task_and_exiting_takes_the_focus_away(): void
    {
        $working = $this->working();

        $this->assertEquals(new FocusTaskCommand('task-42'), $working->onEnter());
        $this->assertEquals(new FocusTaskCommand('task-42'), $working->onResume());
        $this->assertEquals(new UnfocusTaskCommand('task-42'), $working->onExit());
    }

    #[DataProvider('otherHooks')]
    public function test_every_other_hook_is_passed(HookInput $input): void
    {
        $this->assertEquals(Decision::delegate(), $input->answerBy($this->working()));
    }

    private function working(): WorkOnTaskState
    {
        return new WorkOnTaskState('task-42', 42, 1);
    }

    private function agent(): ActorIdentity
    {
        $stop = HookInputs::all()['stop'];

        return ActorIdentity::fromText("agent:{$stop->hook->agentId}");
    }

    private function stop(WorkOnTaskState $working): AnswerType
    {
        return HookInputs::all()['stop']->answerBy($working)->answerType();
    }
}
