<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Work\AgentFocuses;
use Domain\Tasks\Commands\FocusTask\FocusTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * An agent running two tasks focuses on one of them and its focus moves there; focusing on it again leaves it there.
 */
#[TestsCommand(FocusTaskCommand::class)]
final class FocusTaskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'tasks',
        'task_runs',
        'claim_authorizations',
    ];

    public function test_the_focus_moves_to_the_task_and_stays_on_a_second_focus(): void
    {
        $this->journal->owner()->agent('First');
        $first = $this->tasks()->task('First', 'One.')->taskCalled('First');
        $second = $this->tasks()->task('Second', 'Two.')->taskCalled('Second');
        $this->journal->actAs('First')->run(new StartTaskCommand($first->id));
        $this->journal->run(new StartTaskCommand($second->id));

        $this->journal->run(new FocusTaskCommand($first->id));
        $this->journal->run(new FocusTaskCommand($first->id));

        $focus = $this->app->make(AgentFocuses::class)->focusOf($this->journal->actorCalled('First'))->get();
        $this->assertSame($first->id, $focus->id);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
