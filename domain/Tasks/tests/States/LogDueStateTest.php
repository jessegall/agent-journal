<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\States;

use App\Hooks\Enums\AnswerType;
use App\Processes\Contracts\ShellCommandParser;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Support\States\LogDueState;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use Domain\Tasks\Tests\TestCase;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHook;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\TestIds;

/**
 * The log-due state on the real engine: work passes while its budget of tool uses lasts and is refused once it is
 * spent, a read-only line always passes, and a log on its task ends it.
 */
#[TestsState(LogDueState::class)]
final class LogDueStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = [
        'agent_stacks',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $this->journal->owner()->agent('Writer')->pushState('Writer', $this->logDue());
    }

    public function test_work_passes_until_the_budget_is_spent_and_is_refused_after(): void
    {
        $uses = array_fill(0, LogDueState::TOOL_USE_LIMIT - 1, SessionHook::toolFinished());

        $this->journal->stateOn('Writer', $this->logDue(), fn (StateHandle $logDue) => $logDue
            ->steps(
                [...$uses, SessionHook::shell('composer update')],
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            )
            ->steps(
                [SessionHook::toolFinished(), SessionHook::shell('composer update')],
                fn (StateAssert $state) => $state->answers(AnswerType::Deny),
            )
            ->shell(
                'git status',
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            ));
    }

    public function test_a_log_on_its_task_ends_it_and_a_log_on_another_does_not(): void
    {
        $this->journal->stateOn('Writer', $this->logDue(), fn (StateHandle $logDue) => $logDue
            ->event(new TaskLogged(TestIds::of(43), 'entry-1'), fn (StateAssert $state) => $state->isLive())
            ->event(
                new TaskLogged(TestIds::of(42), 'entry-2'),
                fn (StateAssert $state) => $state->isFinished(),
            ));
    }

    private function logDue(): LogDueStateReference
    {
        return LogDueStateReference::forTask(TestIds::of(42), 42);
    }
}
