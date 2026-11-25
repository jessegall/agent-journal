<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Http\Requests\TaskWaitRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class AddTaskWaitPageController
{
    #[Dispatches(AddTaskWaitCommand::class)]
    public function __invoke(TaskWaitRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new AddTaskWaitCommand($request->taskId(), $request->prerequisiteId()));

        return $redirect->back(303);
    }
}
