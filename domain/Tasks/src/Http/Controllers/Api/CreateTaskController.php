<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Projects\Contracts\ProjectDestination;
use Domain\Tasks\Api\CreateTaskPayload;
use Domain\Tasks\Api\TaskNamed;
use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use PhpOption\None;

/**
 * Files a task and answers its id.
 */
final readonly class CreateTaskController
{
    #[Dispatches(CreateTaskCommand::class)]
    public function __invoke(CreateTaskPayload $call, CommandBus $commands, ProjectDestination $destination): TaskNamed
    {
        $command = new CreateTaskCommand($call->title, $call->brief, $destination->projectFor(None::create()));

        return TaskNamed::from(['taskId' => $commands->run($command)]);
    }
}
