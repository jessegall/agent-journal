<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\ReassignPlanWork;
use Domain\Plans\Http\Requests\PlanWorkRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ReassignPlanWorkPageController
{
    public function __invoke(PlanWorkRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ReassignPlanWork($request->workRoot(), $request->expectedRoot(), $request->recipient()));

        return $redirect->back(303);
    }
}
