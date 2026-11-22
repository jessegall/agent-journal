<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\RequestPlanReview\RequestPlanReviewCommand;
use Domain\Plans\Http\Requests\PlanReviewRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class RequestPlanReviewPageController
{
    /**
     * The one asking on the page reviews the plan there.
     */
    public function __invoke(
        PlanReviewRequest $request,
        CommandBus $commands,
        CurrentActor $actors,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new RequestPlanReviewCommand($request->planId(), [ActorIdentity::of($actors->actor())]));

        return $redirect->back(303);
    }
}
