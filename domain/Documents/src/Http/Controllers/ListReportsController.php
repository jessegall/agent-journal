<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Http\Requests\ListRecordsRequest;
use Illuminate\Http\JsonResponse;

final readonly class ListReportsController
{
    public function __invoke(ListRecordsRequest $request, ReportReader $reports): JsonResponse
    {
        return new JsonResponse($reports->list($request->filters()));
    }
}
