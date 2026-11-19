<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Http\Requests\ShowRecordRequest;
use Illuminate\Http\JsonResponse;

final readonly class InspectDocumentController
{
    public function __invoke(ShowRecordRequest $request, DocumentResolver $documents): JsonResponse
    {
        return new JsonResponse($documents->inspect($request->number()));
    }
}
