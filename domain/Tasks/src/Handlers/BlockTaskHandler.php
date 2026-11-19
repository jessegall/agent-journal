<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Handlers\Concerns\RefusesOtherRuns;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class BlockTaskHandler implements CommandHandler
{
    use RefusesOtherRuns;

    public function __construct(
        private Dispatcher $events,
    ) {}

    /**
     * @throws TaskRunNotYours
     */
    public function handle(BlockTask $command, Task $task): void
    {
        $this->refuseUnlessCurrentTaskRun($task, $command->runNumber);
        $task->blockRun($command->reason);
        $this->events->dispatch(new TaskBlocked($command->taskId));
    }
}
