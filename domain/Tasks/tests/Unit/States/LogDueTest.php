<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Unit\States;

use App\Enums\Hooks\AnswerType;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Support\States\LogDueState;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\TestCase;

/**
 * The log-due state lets a few tools through, then refuses work that changes files until its task is logged, and
 * finishes once it hears that log.
 */
final class LogDueTest extends TestCase
{
    public function test_work_passes_until_the_budget_is_spent_and_is_refused_after(): void
    {
        $due = new LogDueState('task-42', 42);
        $shell = HookInputs::all()['shell command'];
        $before = $shell->answerBy($due)->answerType();

        foreach (range(1, LogDueState::TOOL_USE_LIMIT) as $use) {
            $due->onToolFinished(HookInputs::all()['tool finished']);
        }

        $this->assertSame(AnswerType::Delegate, $before);
        $this->assertSame(AnswerType::Deny, $shell->answerBy($due)->answerType());
        $this->assertSame(AnswerType::Deny, HookInputs::all()['file edit']->answerBy($due)->answerType());
    }

    public function test_a_log_on_its_task_finishes_it_and_a_log_on_another_does_not(): void
    {
        $due = new LogDueState('task-42', 42);
        $due->onTaskLogged(new TaskLogged('task-7', 'entry-1'));
        $open = $due->isFinished();
        $due->onTaskLogged(new TaskLogged('task-42', 'entry-2'));

        $this->assertFalse($open);
        $this->assertTrue($due->isFinished());
    }
}
