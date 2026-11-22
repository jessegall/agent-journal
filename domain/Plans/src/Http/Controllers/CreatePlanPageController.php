<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\CreatePlan;
use Domain\Plans\Http\Requests\CreatePlanRequest;
use Domain\Plans\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Files a plan from the create dialog and follows the server to the new plan's own page.
 */
final readonly class CreatePlanPageController
{
    public function __invoke(CreatePlanRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $id = $commands->run(new CreatePlan($request->title(), $request->brief(), $request->type()));

        return $redirect->to(route('plans.plan', ['plan' => Plan::query()->findOrFail($id)->number], false), 303);
    }
}
