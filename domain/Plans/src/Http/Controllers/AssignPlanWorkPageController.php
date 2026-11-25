<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\Http\Requests\PlanWorkRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class AssignPlanWorkPageController
{
    #[Dispatches(AssignPlanWorkCommand::class)]
    public function __invoke(PlanWorkRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new AssignPlanWorkCommand($request->workRoot(), $request->recipient()));

        return $redirect->back(303);
    }
}
