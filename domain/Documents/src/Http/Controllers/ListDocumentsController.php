<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Http\Requests\ListRecordsRequest;
use Illuminate\Http\JsonResponse;

final readonly class ListDocumentsController
{
    public function __invoke(ListRecordsRequest $request, DocumentReader $documents): JsonResponse
    {
        return new JsonResponse($documents->list($request->filters()));
    }
}
