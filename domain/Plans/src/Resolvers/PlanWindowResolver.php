<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Ui\Contracts\PageResolver;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanReaderData;
use Domain\Plans\Http\Requests\PlanRequest;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One plan's record page, on its own route or open in the inspector: the same reader the list shows. A plan that
 * cannot be read answers as not found, never as a failed window.
 */
final readonly class PlanWindowResolver implements PageResolver
{
    public function __construct(
        private PlanRequest $request,
        private PlanResolver $records,
    ) {}

    public function read(): PlanReaderData
    {
        $resolver = PlanReaderData::ofSelection(
            $this->records->list(new PlanFilters(selectedPlanId: $this->request->planId()))->selection,
        );

        return $resolver instanceof Optional ? throw new NotFoundHttpException() : $resolver;
    }
}
