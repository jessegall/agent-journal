<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\FocusTask;

use App\Contracts\Work\AgentFocuses;
use App\Contracts\Work\AgentStacks;
use App\Exceptions\FrameNotHeld;
use App\Support\ActorIdentity;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskChangedSinceRead;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\States\Support\WorkOnTaskStateReference;

final readonly class FocusTaskHandler extends TaskCommandHandler
{
    public function __construct(private AgentStacks $stacks, private AgentFocuses $focuses) {}

    /**
     * Under the task's lock: only a started task takes the caller's focus, moving it off what it focused on before,
     * and the task's work comes back on top of the caller's stack, which must hold it.
     *
     * @throws TaskChangedSinceRead
     * @throws FrameNotHeld
     */
    public function handle(FocusTaskCommand $command, Task $task): void
    {
        $this->focuses->focus(ActorIdentity::of($command->dispatchedBy()), $task);
        $this->stacks->liftForCaller(WorkOnTaskStateReference::forTask($task));
    }
}
