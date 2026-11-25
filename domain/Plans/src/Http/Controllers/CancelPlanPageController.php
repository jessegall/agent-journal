<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\Http\Requests\PlanEndRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CancelPlanPageController
{
    #[Dispatches(CancelPlanCommand::class)]
    public function __invoke(PlanEndRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CancelPlanCommand(
            $request->planId(),
            $request->expectedRevision(),
            $request->text(),
            $request->expectedState(),
        ));

        return $redirect->back(303);
    }
}
