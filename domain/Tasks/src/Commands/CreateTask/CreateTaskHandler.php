<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\CreateTask;

use App\Contracts\Hosts\ServedEnvironment;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;

/**
 * Files the task for its actor, in the environment of the connected binding the command came through, if any.
 */
final readonly class CreateTaskHandler extends TaskCommandHandler
{
    public function __construct(private ServedEnvironment $environment) {}

    public function handle(CreateTaskCommand $command): string
    {
        $creator = $command->dispatchedBy();

        return Task::create(
            $command->title,
            $command->brief,
            $creator,
            $command->owner(),
            $this->environment->environmentIds(),
        )->id;
    }
}
