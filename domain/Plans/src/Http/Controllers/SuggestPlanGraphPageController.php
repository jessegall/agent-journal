<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use Domain\Plans\Http\Requests\PlanGraphRequest;
use Domain\Plans\Support\PlanGraphEditor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class SuggestPlanGraphPageController
{
    public function __invoke(
        PlanGraphRequest $request,
        PlanGraphEditor $editing,
        Redirector $redirect,
    ): RedirectResponse {
        $editing->suggest($request->plan());

        return $redirect->back(303);
    }
}
