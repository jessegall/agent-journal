<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\RemoveTaskWait\RemoveTaskWaitCommand;
use Domain\Tasks\Http\Requests\TaskWaitRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class RemoveTaskWaitPageController
{
    #[Dispatches(RemoveTaskWaitCommand::class)]
    public function __invoke(TaskWaitRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RemoveTaskWaitCommand($request->taskId(), $request->prerequisiteId()));

        return $redirect->back(303);
    }
}
