<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\RequestPlanChanges\RequestPlanChangesCommand;
use Domain\Plans\Http\Requests\PlanReviewRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class RequestPlanChangesPageController
{
    #[Dispatches(RequestPlanChangesCommand::class)]
    public function __invoke(PlanReviewRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RequestPlanChangesCommand(
            $request->planId(),
            $request->editionNumber(),
            $request->requestKey(),
            $request->reason(),
        ));

        return $redirect->back(303);
    }
}
