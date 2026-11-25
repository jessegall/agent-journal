<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use Domain\Tasks\Commands\EditTask\EditTaskCommand;
use Domain\Tasks\Exceptions\TaskRevisionChanged;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * A task's title or brief changes at the revision its editor read and moves the revision on; a stale revision is a
 * conflict that keeps the newer text, and an edit with neither title nor brief is refused naming the title.
 */
final class EditTaskTest extends TestCase
{
    use RefreshHookDatabase;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->task = $this->tasks()->task('First', 'First brief')->taskCalled('First');
    }

    public function test_an_edit_changes_what_it_names_and_moves_the_revision_on(): void
    {
        $revision = $this->journal->run(new EditTaskCommand($this->task->id, 1, brief: 'Second brief'));

        $this->assertSame([2, 'First', 'Second brief'], [$revision, $this->task->refresh()->title, $this->task->brief]);
    }

    public function test_a_stale_revision_is_a_conflict_and_nothing_to_change_is_refused(): void
    {
        $this->journal->run(new EditTaskCommand($this->task->id, 1, 'Second'));

        $this->assertThrows(
            fn () => $this->journal->run(new EditTaskCommand($this->task->id, 1, 'Stale')),
            TaskRevisionChanged::class,
        );
        $this->assertThrows(
            fn () => $this->journal->run(new EditTaskCommand($this->task->id, 2)),
            CommandInputInvalid::class,
            'title:',
        );
        $this->assertSame(['Second', 2], [$this->task->refresh()->title, $this->task->revision]);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
