<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Commands\ApprovePlanReview\ApprovePlanReviewCommand;
use Domain\Plans\Http\Requests\PlanReviewRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ApprovePlanReviewPageController
{
    public function __invoke(PlanReviewRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ApprovePlanReviewCommand($request->planId(), $request->editionNumber(), $request->requestKey()));

        return $redirect->back(303);
    }
}
