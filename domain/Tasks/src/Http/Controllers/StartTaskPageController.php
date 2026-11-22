<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Http\Requests\TaskActionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class StartTaskPageController
{
    public function __invoke(TaskActionRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new StartTaskCommand($request->taskId()));

        return $redirect->back(303);
    }
}
