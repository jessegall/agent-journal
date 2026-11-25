<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Work\AgentFocuses;
use Domain\Tasks\Commands\FocusTask\FocusTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Commands\UnfocusTask\UnfocusTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * An agent takes a task out of its focus; unfocusing a task it does not focus on leaves the focus where it is.
 */
#[TestsCommand(UnfocusTaskCommand::class)]
final class UnfocusTaskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'tasks',
        'task_runs',
        'claim_authorizations',
    ];

    public function test_the_focused_task_leaves_the_focus_and_another_task_leaves_it_alone(): void
    {
        $this->journal->owner()->agent('First');
        $first = $this->tasks()->task('First', 'One.')->taskCalled('First');
        $second = $this->tasks()->task('Second', 'Two.')->taskCalled('Second');
        $this->journal->actAs('First')->run(new StartTaskCommand($first->id));
        $this->journal->run(new StartTaskCommand($second->id));
        $this->journal->run(new FocusTaskCommand($first->id));
        $focuses = $this->app->make(AgentFocuses::class);

        $this->journal->run(new UnfocusTaskCommand($second->id));
        $this->assertSame($first->id, $focuses->focusOf($this->journal->actorCalled('First'))->get()->id);

        $this->journal->run(new UnfocusTaskCommand($first->id));
        $this->assertTrue($focuses->focusOf($this->journal->actorCalled('First'))->isEmpty());
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
