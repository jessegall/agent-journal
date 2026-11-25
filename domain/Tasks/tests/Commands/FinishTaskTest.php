<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Exceptions\ActorNotAllowed;
use App\Exceptions\CommandInputInvalid;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * The agent that runs a task finishes it with its note and works on it no more; another agent is refused, and a note
 * past its limit is refused before the run ends.
 */
final class FinishTaskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['tasks', 'task_runs', 'claim_authorizations'];

    private Task $task;

    private int $run;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('First')->agent('Second', 'read-only-helper');
        $this->task = Task::create('Owned work', 'Build it.', $this->journal->ownerUser());
        $this->run = $this->journal->actAs('First')->run(new StartTaskCommand($this->task->id));
    }

    public function test_the_runner_finishes_with_its_note_and_works_on_it_no_more(): void
    {
        $this->journal->run(new FinishTaskCommand($this->task->id, $this->run, 'Built and tested.'));

        $this->assertSame(
            [TaskStatus::Finished, 'Built and tested.'],
            [$this->task->refresh()->status, $this->task->result_note],
        );
        $this->assertTrue($this->app->make(AssignedTaskResolver::class)->currentForCaller()->isEmpty());
    }

    public function test_another_agent_and_a_note_past_its_limit_are_refused_and_the_task_still_runs(): void
    {
        $longNote = str_repeat('é', Task::NOTE_CHARACTER_LIMIT + 1);

        $this->assertThrows(
            fn () => $this->journal->run(new FinishTaskCommand($this->task->id, $this->run, $longNote)),
            CommandInputInvalid::class,
            'note:',
        );
        $this->assertThrows(
            fn () => $this->journal->actAs('Second')->run(new FinishTaskCommand($this->task->id, $this->run, 'Mine.')),
            ActorNotAllowed::class,
        );
        $this->assertSame(TaskStatus::Started, $this->task->refresh()->status);
    }
}
