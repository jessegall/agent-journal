<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use App\Contracts\Actors\Actor;
use App\Contracts\Processes\RunClaims;
use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Commands\WaiveTaskWait\WaiveTaskWaitCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Models\TaskWait;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;

/**
 * Tasks, their runs and their waits, kept under the names a test gives them: a task is made open, a run is started by
 * the named agent through the Tasks command, and a wait is added or waived as the owner adds or waives one.
 */
final class TaskFixtures
{
    private const string BRIEF = 'What the task sets out to do.';

    private readonly FixtureAliases $aliases;

    public function __construct(private readonly TestJournal $journal)
    {
        $this->aliases = new FixtureAliases('TaskFixtures');
    }

    /**
     * An open task, made by the owner unless another creator is given, in the environments named by id.
     *
     * @param  list<string>  $environmentIds
     */
    public function task(
        string $name,
        string $brief = self::BRIEF,
        Actor|null $creator = null,
        array $environmentIds = [],
    ): self {
        $this->aliases->claim($name);
        $task = Task::create($name, $brief, $creator ?? $this->journal->ownerUser(), $environmentIds);
        $this->aliases->remember($name, $task);

        return $this;
    }

    /**
     * The open task the naming verb makes, given back at once instead of read back by its name.
     *
     * @param  list<string>  $environmentIds
     */
    public function createTask(
        string $name,
        string $brief = self::BRIEF,
        Actor|null $creator = null,
        array $environmentIds = [],
    ): Task {
        return $this->task($name, $brief, $creator, $environmentIds)->taskCalled($name);
    }

    /**
     * A task the owner made that already stands in this state, with no run behind it, for reads of every state.
     */
    public function taskIn(string $name, TaskStatus $status): self
    {
        $this->aliases->claim($name);
        $owner = $this->journal->ownerUser();

        $task = Task::factory()->create([
            'title' => $name,
            'status' => $status,
            'creator_type' => $owner->actorType(),
            'creator_id' => $owner->actorId(),
        ]);

        $this->aliases->remember($name, $task);

        return $this;
    }

    /**
     * A task its owner finished with this outcome, without a run.
     */
    public function finishedTask(string $name, string $outcome = 'Done.'): self
    {
        $this->task($name)->taskCalled($name)->finish($outcome);

        return $this;
    }

    /**
     * A task its owner cancelled for this reason.
     */
    public function cancelledTask(string $name, string $reason = 'Not needed.'): self
    {
        $this->task($name)->taskCalled($name)->cancel($reason);

        return $this;
    }

    /**
     * The named agent starts a run of the task through the Tasks command and is left acting.
     */
    public function startRun(string $task, string $agent): self
    {
        $this->journal->actAs($agent)->run(new StartTaskCommand($this->taskCalled($task)->id));

        return $this;
    }

    public function waitFor(string $task, string $prerequisite): self
    {
        $dependent = $this->taskCalled($task)->id;
        $this->journal->asOwner(new AddTaskWaitCommand($dependent, $this->taskCalled($prerequisite)->id));

        return $this;
    }

    public function waiveWait(string $task, string $prerequisite, string $reason): self
    {
        $dependent = $this->taskCalled($task)->id;
        $this->journal->asOwner(new WaiveTaskWaitCommand($dependent, $this->taskCalled($prerequisite)->id, $reason));

        return $this;
    }

    public function taskCalled(string $name): Task
    {
        return $this->aliases->model(Task::class, $name);
    }

    public function runOf(string $task, int $number): TaskRun
    {
        return TaskRun::findForTask($this->taskCalled($task), $number) ?? Assert::fail("{$task} has no run {$number}.");
    }

    public function currentRunOf(string $task): TaskRun
    {
        return $this->taskCalled($task)->currentRun() ?? Assert::fail("{$task} was never started.");
    }

    /**
     * The task's current run is claimed by the named agent.
     */
    public function assertStarted(string $task, string $by): self
    {
        $run = $this->currentRunOf($task)->assignmentIdentity();
        $holder = $this->journal->service(RunClaims::class)->holderOf($run);

        Assert::assertSame($this->journal->agentCalled($by)->id, $holder->get()->id, "{$by} does not hold {$task}.");

        return $this;
    }

    public function assertRunCount(string $task, int $count): self
    {
        Assert::assertSame($count, TaskRun::query()->where('task_id', $this->taskCalled($task)->id)->count());

        return $this;
    }

    /**
     * The run of the task holds exactly these log lines, in order.
     *
     * @param  list<string>  $lines
     */
    public function assertLog(string $task, int $run, array $lines): self
    {
        $logged = TaskLogEntry::query()
            ->ofTask($this->taskCalled($task)->id)
            ->where('run_number', $run)
            ->inSequenceOrder()
            ->pluck('text')
            ->all();

        Assert::assertSame($lines, $logged, "Run {$run} of {$task} holds other log lines.");

        return $this;
    }

    /**
     * The task waits on the prerequisite, met or not, waived or not.
     */
    public function assertWait(string $task, string $prerequisite, bool $isSatisfied, bool $isWaived = false): self
    {
        $before = $this->taskCalled($prerequisite);

        $wait = TaskWait::findBetween($this->taskCalled($task)->id, $before->id)
            ?? Assert::fail("{$task} does not wait on {$prerequisite}.");

        Assert::assertSame([
            $isSatisfied,
            $isWaived,
        ], [
            $wait->isSatisfiedBy($before->status),
            $wait->isWaived(),
        ]);

        return $this;
    }
}
