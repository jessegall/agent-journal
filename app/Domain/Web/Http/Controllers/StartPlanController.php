<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Plans\Contracts\PlanStarter;
use App\Domain\Web\Data\StartPlanInput;
use App\Domain\Web\Http\RouteId;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Starts the plan through Plans, then returns to the plans page with the validated filters (303, a fresh GET). An id
 * that is no positive whole number within PHP's range is not found before anything runs; Plans decides the rest, and
 * its refusals are shown by the renderers in WebServiceProvider.
 */
final readonly class StartPlanController
{
    public function __construct(
        private PlanStarter $plans,
        private Redirector $redirect,
    ) {}

    public function __invoke(string $plan, StartPlanInput $input): RedirectResponse
    {
        $this->plans->start(RouteId::of($plan));

        return $this->redirect->route('plans.index', $input->filters->toQuery(), 303);
    }
}
