<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Http\Requests\ShowRecordRequest;
use Illuminate\Http\JsonResponse;

final readonly class ReportCommentsController
{
    public function __invoke(ShowRecordRequest $request, ReportReader $records): JsonResponse
    {
        return new JsonResponse(['comments' => $records->comments($request->number(), $request->page())]);
    }
}
