<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\RemoveTaskWait;
use Domain\Tasks\Http\Requests\TaskWaitRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class RemoveTaskWaitPageController
{
    public function __invoke(TaskWaitRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RemoveTaskWait($request->taskId(), $request->prerequisiteId()));

        return $redirect->back(303);
    }
}
