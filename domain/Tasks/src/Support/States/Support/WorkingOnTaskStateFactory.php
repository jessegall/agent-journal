<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\States\Support;

use App\Contracts\Processes\RunClaims;
use App\Enums\SessionTransferType;
use App\Support\ActorIdentity;
use App\Support\Decisions\StateReferences;
use App\Support\References\SubjectReference;
use App\Support\StateLoading\Contracts\RecipientStateLoader;
use App\Support\StateLoading\StateSet;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Resolvers\Support\TaskRecords;
use Domain\Tasks\Support\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;
use Illuminate\Contracts\Container\Container;

/**
 * Builds the working-on-task state from the task as it is now; it keeps no task between calls. Read for a stack's
 * agent, a frame works only while that agent holds a valid claim on the exact run it names.
 */
final readonly class WorkingOnTaskStateFactory implements RecipientStateLoader
{
    /**
     * The container hands out the run claims per read: the state types live for the whole process, the claims for
     * one request.
     */
    public function __construct(private TaskRecords $tasks, private Container $container) {}

    public function stateClass(): string
    {
        return WorkingOnTaskState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $tasks = $this->tasks->many($references->subjectIds());

        return $this->build($references, $tasks, fn (Task $task, int $runNumber) => $task->workFor($runNumber));
    }

    public function statesForRecipient(StateReferences $references, ActorIdentity $recipient): StateSet
    {
        $tasks = $this->tasks->many($references->subjectIds());
        $runs = $this->runsOf($references, $tasks);

        $holders = $this->container->make(RunClaims::class)->holdersOf(
            array_values(array_map(fn (TaskRun $run) => $run->assignmentIdentity(), $runs)),
        );

        $workOf = function (Task $task, int $runNumber) use ($runs, $holders, $recipient): TaskWork {
            $run = $runs["{$task->id}:{$runNumber}"] ?? null;
            $holder = $run === null ? null : $holders[$run->id] ?? null;
            $work = $task->workFor($runNumber);

            return $holder !== null && $holder->isSameAs($recipient) ? $work : $work->unheld();
        };

        return $this->build($references, $tasks, $workOf);
    }

    /**
     * @param  array<string, Task>  $tasks
     * @param  callable(Task, int): TaskWork  $workOf
     */
    private function build(StateReferences $references, array $tasks, callable $workOf): StateSet
    {
        return StateSet::forSubjects(
            $references,
            $tasks,
            fn (Task $task, SubjectReference $subject) => new WorkingOnTaskState($workOf($task, $subject->runNumber)),
        );
    }

    /**
     * The started run each reference names, keyed by task id and run number, read in one query.
     *
     * @param  array<string, Task>  $tasks
     * @return array<string, TaskRun>
     */
    private function runsOf(StateReferences $references, array $tasks): array
    {
        $pairs = [];

        foreach ($references->references as $reference) {
            $subject = $reference->subject;

            if ($subject instanceof SubjectReference && isset($tasks[$subject->id])) {
                $pairs["{$subject->id}:{$subject->runNumber}"] = [$subject->id, $subject->runNumber];
            }
        }

        return TaskRun::ofPairs(array_values($pairs))
            ->keyBy(fn (TaskRun $run) => "{$run->task_id}:{$run->run_number}")
            ->all();
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::Durable;
    }
}
