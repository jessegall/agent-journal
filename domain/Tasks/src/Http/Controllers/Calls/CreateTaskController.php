<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Calls\CreateTaskCall;
use Domain\Tasks\Calls\TaskNamed;
use Domain\Tasks\Commands\CreateTask;

/**
 * Files a task and answers its id.
 */
final readonly class CreateTaskController
{
    public function __invoke(CreateTaskCall $call, CommandBus $commands): TaskNamed
    {
        return TaskNamed::from(['taskId' => $commands->run(new CreateTask($call->title, $call->brief))]);
    }
}
