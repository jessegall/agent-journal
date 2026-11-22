<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;
use Domain\Plans\Http\Requests\PlanEndRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class FinishPlanPageController
{
    public function __invoke(PlanEndRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new FinishPlanCommand($request->planId(), $request->expectedRevision(), $request->text()));

        return $redirect->back(303);
    }
}
