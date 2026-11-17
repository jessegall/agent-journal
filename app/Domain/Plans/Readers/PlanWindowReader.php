<?php

declare(strict_types=1);

namespace App\Domain\Plans\Readers;

use App\Core\Ui\Contracts\PageReader;
use App\Domain\Plans\Api\PlanFilters;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Data\PlanReaderData;
use App\Domain\Plans\Http\Requests\PlanRequest;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One plan's record page, on its own route or open in the inspector: the same reader the list shows. A plan that
 * cannot be read answers as not found, never as a failed window.
 */
final readonly class PlanWindowReader implements PageReader
{
    public function __construct(
        private PlanRequest $request,
        private PlanReader $records,
    ) {}

    public function read(): PlanReaderData
    {
        $reader = PlanReaderData::ofSelection($this->records->list(new PlanFilters(selectedPlanId: $this->request->planId()))->selection);

        return $reader instanceof Optional ? throw new NotFoundHttpException : $reader;
    }
}
