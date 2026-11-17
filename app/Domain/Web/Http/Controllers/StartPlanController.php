<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Plans\Actions\StartPlan;
use App\Domain\Plans\Models\Plan;
use App\Domain\Web\Data\StartPlanInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Starts the plan through Plans, then returns to the plans page with the validated filters (303, a fresh GET).
 * Plans decides and changes everything; a refusal is shown by the StartDenied renderer in WebServiceProvider.
 */
final readonly class StartPlanController
{
    public function __construct(
        private StartPlan $startPlan,
        private Redirector $redirect,
    ) {}

    public function __invoke(Plan $plan, StartPlanInput $input): RedirectResponse
    {
        $this->startPlan->start($plan);

        return $this->redirect->route('plans.index', $input->filters->toQuery(), 303);
    }
}
