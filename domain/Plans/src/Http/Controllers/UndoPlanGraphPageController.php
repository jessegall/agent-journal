<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use Domain\Plans\Http\Requests\PlanGraphRequest;
use Domain\Plans\Support\PlanGraphEditing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class UndoPlanGraphPageController
{
    public function __invoke(
        PlanGraphRequest $request,
        PlanGraphEditing $editing,
        Redirector $redirect,
    ): RedirectResponse {
        $editing->undo($request->plan());

        return $redirect->back(303);
    }
}
