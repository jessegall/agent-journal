<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use Domain\Plans\Http\Requests\PlanGraphRequest;
use Domain\Plans\Support\PlanGraphService;
use Domain\Tasks\Commands\ApplyTaskWaits\ApplyTaskWaitsCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ApplyPlanGraphPageController
{
    #[Dispatches(ApplyTaskWaitsCommand::class)]
    public function __invoke(
        PlanGraphRequest $request,
        PlanGraphService $editing,
        Redirector $redirect,
    ): RedirectResponse {
        $editing->apply($request->plan());

        return $redirect->back(303);
    }
}
