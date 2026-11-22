<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\RequestPlanReview;
use Domain\Plans\Http\Requests\PlanReviewRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class RequestPlanReviewPageController
{
    public function __invoke(PlanReviewRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RequestPlanReview($request->planId()));

        return $redirect->back(303);
    }
}
