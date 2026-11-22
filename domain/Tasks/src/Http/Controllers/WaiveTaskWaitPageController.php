<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\WaiveTaskWait;
use Domain\Tasks\Http\Requests\TaskWaitRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class WaiveTaskWaitPageController
{
    public function __invoke(TaskWaitRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new WaiveTaskWait(
            $request->taskId(),
            $request->prerequisiteId(),
            $request->requestKey(),
            $request->reason(),
        ));

        return $redirect->back(303);
    }
}
