<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Domain\Plans\Http\Requests\PlanWorkRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ReassignPlanWorkPageController
{
    public function __invoke(PlanWorkRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(
            new ReassignPlanWorkCommand($request->workRoot(), $request->expectedRoot(), $request->recipient()),
        );

        return $redirect->back(303);
    }
}
