<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Http\Requests\TaskActionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CancelTaskPageController
{
    public function __invoke(TaskActionRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CancelTask(
            $request->taskId(),
            $request->reason(),
            $request->expectedRevision(),
            $request->expectedRunNumber(),
        ));

        return $redirect->back(303);
    }
}
