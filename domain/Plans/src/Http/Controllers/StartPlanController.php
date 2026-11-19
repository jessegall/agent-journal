<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Http\Requests\StartPlanRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Starts the plan by running the StartPlan command, then returns to the page the start came from, the plans page or
 * Home with every
 * window's query (303, a fresh GET). An id
 * that is no ULID is not found before anything runs; Plans decides the rest, and
 * its refusals are shown by the renderers in WebServiceProvider.
 */
final readonly class StartPlanController
{
    public function __invoke(StartPlanRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new StartPlan($request->planId()));

        return $redirect->back(303);
    }
}
