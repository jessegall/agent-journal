<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Contracts\CommandBus;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Http\Requests\TaskActionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class BlockTaskPageController
{
    public function __invoke(TaskActionRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new BlockTaskCommand($request->taskId(), $request->expectedRunNumber(), $request->reason()));

        return $redirect->back(303);
    }
}
