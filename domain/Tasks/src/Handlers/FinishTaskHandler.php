<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use App\Desks\Contracts\RunClaims;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Handlers\Concerns\RefusesOtherRuns;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class FinishTaskHandler implements CommandHandler
{
    use RefusesOtherRuns;

    public function __construct(
        private Dispatcher $events,
        private RunClaims $claims,
    ) {}

    /**
     * @throws TaskRunNotYours
     * @throws TaskRunFinished
     */
    public function handle(FinishTask $command, Task $task): void
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $task->finishRun($command->note);
        $run = $task->currentRun();

        if ($run !== null) {
            $run->finish($command->note);
            $this->claims->release($run->assignmentIdentity());
        }
        $this->events->dispatch(new TaskFinished($command->taskId));
    }
}
