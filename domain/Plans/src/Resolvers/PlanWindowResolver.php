<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Ui\Contracts\PageResolver;
use Domain\Plans\Api\PlanSelection;
use Domain\Plans\Data\PlanReaderData;
use Domain\Plans\Http\Requests\PlanRequest;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanOutline;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One plan's record page, on its own route or open in the inspector: the plan read directly by its number, with its
 * brief and the page of its outline the reader asked for, never through the plans list. A plan that cannot be read
 * answers as not found, never as a failed window.
 */
final readonly class PlanWindowResolver implements PageResolver
{
    public function __construct(
        private PlanRequest $request,
        private PlanRecords $records,
        private PlanOutline $outline,
    ) {}

    public function read(): PlanReaderData
    {
        $plan = Plan::query()->find($this->request->planId()) ?? throw new NotFoundHttpException();
        $card = $this->records->cardOf($plan);

        $reader = PlanReaderData::ofSelection(
            PlanSelection::found($card, true, $plan->brief),
            $this->outline->of($plan->id, $card->currentPhase, $this->request->outlinePageAsk()),
        );

        return $reader instanceof Optional ? throw new NotFoundHttpException() : $reader;
    }
}
