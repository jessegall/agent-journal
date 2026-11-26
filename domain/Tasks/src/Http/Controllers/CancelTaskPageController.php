<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Http\Requests\TaskActionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CancelTaskPageController
{
    #[Dispatches(CancelTaskCommand::class)]
    public function __invoke(TaskActionRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CancelTaskCommand(
            $request->taskId(),
            $request->reason(),
            $request->expectedRevision(),
            $request->expectedRunNumber(),
        ));

        return $redirect->back(303);
    }
}
