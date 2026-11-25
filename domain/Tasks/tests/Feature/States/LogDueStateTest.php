<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\States;

use App\Enums\Hooks\AnswerType;
use App\Enums\Hooks\ToolOutcome;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\ToolResult;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Support\States\LogDueState;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\StateScenario;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestsStates;

/**
 * The log-due state on the real engine: work passes while its budget of tool uses lasts and is refused once it is
 * spent, a read-only line always passes, and a log on its task ends it.
 */
final class LogDueStateTest extends TestCase
{
    use TestsStates;

    public function test_work_passes_until_the_budget_is_spent_and_is_refused_after(): void
    {
        $scenario = $this->logDue();

        for ($use = 1; $use < LogDueState::TOOL_USE_LIMIT; $use++) {
            $scenario->given($this->toolFinished());
        }

        $this->assertSame(AnswerType::Delegate, $scenario->given($this->shell('composer update'))->lastStateAnswer());

        $scenario->given($this->toolFinished());

        $this->assertSame(AnswerType::Deny, $scenario->given($this->shell('composer update'))->lastStateAnswer());
        $this->assertSame(AnswerType::Delegate, $scenario->given($this->shell('git status'))->lastStateAnswer());
    }

    public function test_a_log_on_its_task_ends_it_and_a_log_on_another_does_not(): void
    {
        $this->logDue()
            ->given(new TaskLogged(TestIds::of(43), 'entry-1'))
            ->assertActive()
            ->given(new TaskLogged(TestIds::of(42), 'entry-2'))
            ->assertPopped();
    }

    private function logDue(): StateScenario
    {
        return $this->scenario(LogDueStateReference::forTask(TestIds::of(42), 42));
    }

    private function toolFinished(): ToolFinished
    {
        return new ToolFinished(
            TestActors::hookIdentity(1, 10, 'call-1', self::inputDigest()),
            new ToolResult('Bash', ToolOutcome::Succeeded, new DriverToolInput(['command' => 'ls'])),
        );
    }
}
