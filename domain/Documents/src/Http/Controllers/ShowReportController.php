<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Http\Requests\ShowRecordRequest;
use Illuminate\Http\JsonResponse;

final readonly class ShowReportController
{
    public function __invoke(ShowRecordRequest $request, ReportReader $reports): JsonResponse
    {
        return new JsonResponse($reports->read($request->number(), $request->selection()));
    }
}
