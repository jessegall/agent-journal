<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\FocusTask;

use App\Contracts\Actors\ActorWorkStacks;
use App\Exceptions\FrameNotHeld;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskChangedSinceRead;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\States\Support\WorkingOnTaskStateReference;

final readonly class FocusTaskHandler extends TaskCommandHandler
{
    public function __construct(private ActorWorkStacks $workStacks) {}

    /**
     * Under the task's lock: only a started task takes the focus; the caller's other focused task gives it up, and the
     * task's work comes back on top of the caller's stack, which must hold it.
     *
     * @throws TaskChangedSinceRead
     * @throws FrameNotHeld
     */
    public function handle(FocusTaskCommand $command, Task $task): void
    {
        $agentId = $command->dispatchedBy()->id;
        $others = Task::query()->focusedBy($agentId)->whereKeyNot($task->id)->lockForUpdate()->limit(10)->get();

        foreach ($others as $other) {
            $other->unfocus();
        }

        $task->focusFor($agentId);
        $this->workStacks->lift(WorkingOnTaskStateReference::forTask($task));
    }
}
