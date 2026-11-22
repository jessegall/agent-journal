<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Http\Requests\PlanEndRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CancelPlanPageController
{
    public function __invoke(PlanEndRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CancelPlan(
            $request->planId(),
            $request->expectedRevision(),
            $request->text(),
            $request->expectedState(),
        ));

        return $redirect->back(303);
    }
}
