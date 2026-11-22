<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Commands\WithdrawPlanReview\WithdrawPlanReviewCommand;
use Domain\Plans\Http\Requests\PlanReviewRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class WithdrawPlanReviewPageController
{
    public function __invoke(PlanReviewRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new WithdrawPlanReviewCommand($request->planId()));

        return $redirect->back(303);
    }
}
