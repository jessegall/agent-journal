<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Api\CreateTaskPayload;
use Domain\Tasks\Api\TaskNamed;
use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;

/**
 * Files a task and answers its id.
 */
final readonly class CreateTaskController
{
    public function __invoke(CreateTaskPayload $call, CommandBus $commands): TaskNamed
    {
        return TaskNamed::from(['taskId' => $commands->run(new CreateTaskCommand($call->title, $call->brief))]);
    }
}
