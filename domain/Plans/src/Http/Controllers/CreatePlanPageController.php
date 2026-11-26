<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Projects\ProjectDestination;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Http\Requests\CreatePlanRequest;
use Domain\Plans\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Files a plan from the create dialog and follows the server to the new plan's own page.
 */
final readonly class CreatePlanPageController
{
    #[Dispatches(CreatePlanCommand::class)]
    public function __invoke(
        CreatePlanRequest $request,
        CommandBus $commands,
        ProjectDestination $destination,
        Redirector $redirect,
    ): RedirectResponse {
        $id = $commands->run(new CreatePlanCommand(
            $request->title(),
            $request->brief(),
            $request->type(),
            $destination->projectFor($request->chosenProject()),
        ));

        return $redirect->to(route('plans.plan', ['plan' => Plan::query()->findOrFail($id)->number], false), 303);
    }
}
